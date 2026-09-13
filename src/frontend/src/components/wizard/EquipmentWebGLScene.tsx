import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { ComponentConfig, RobotConfig } from '../../store/types';
import type { AssemblyViewMode } from '../../store/domain/assembly';

export type EquipmentCameraView = 'iso' | 'top' | 'front' | 'side' | 'free';

type Props = {
  config: RobotConfig;
  components: ComponentConfig[];
  selectedComponentId?: string | null;
  cameraView: EquipmentCameraView;
  assemblyView: AssemblyViewMode;
  explodeUnresolved: boolean;
  zoomCommand: number;
  onSelectComponent: (component: ComponentConfig) => void;
  onCameraInteraction?: () => void;
};

type VisualKind = 'wheel' | 'lidar' | 'button' | 'battery' | 'controller' | 'io' | 'motor' | 'driver' | 'module';

type WheelDisplayPose = { x: number; y: number; z: number; slot: string };

const WHEEL_SLOT_LABELS: Record<string, string[]> = {
  STANDARD_DIFF: ['左驱动轮', '右驱动轮'],
  SINGLE_STEER: ['舵轮'],
  DUAL_STEER: ['前舵轮', '后舵轮'],
  QUAD_STEER: ['左前舵轮', '右前舵轮', '左后舵轮', '右后舵轮'],
};

const CATEGORY_COLORS: Record<VisualKind, number> = {
  wheel: 0x171b1d,
  lidar: 0x44c8da,
  button: 0xe24a4a,
  battery: 0xe0a83f,
  controller: 0x5478a6,
  io: 0x7b68a6,
  motor: 0x69757a,
  driver: 0x426a78,
  module: 0x6d7a7e,
};

const CHASSIS_SHELL_OPACITY: Record<AssemblyViewMode, number> = {
  body: 0.42,
  transparent: 0.22,
  wheel: 0.12,
  exploded: 0.34,
};

const CHASSIS_DECK_OPACITY: Record<AssemblyViewMode, number> = {
  body: 0.2,
  transparent: 0.1,
  wheel: 0.06,
  exploded: 0.16,
};

const classifyVisual = (component: ComponentConfig): VisualKind => {
  const text = `${component.category} ${component.type} ${component.name} ${component.alias}`.toUpperCase();
  if (component.category === 'DRIVEWHEEL' || text.includes('WHEEL')) return 'wheel';
  if (component.category === 'SENSOR' && (text.includes('LASER') || text.includes('LIDAR') || text.includes('LS-'))) return 'lidar';
  if (component.category === 'BUTTON' || text.includes('BUTTON') || text.includes('ESTOP')) return 'button';
  if (component.category === 'BATTERY') return 'battery';
  if (component.category === 'MAINCPU' || component.category === 'CONTROL' || component.category === 'INTERGRATEDCONTROLLER') return 'controller';
  if (component.category === 'IO_BOARD') return 'io';
  if (component.category === 'MOTOR' || text.includes('MOTOR')) return 'motor';
  if (component.category === 'DRIVER' || text.includes('DRIVER')) return 'driver';
  return 'module';
};

const hasExplicitPose = (component: ComponentConfig) => {
  const rawStruct = component.rawCmodelComponent?.structParam || component.rawCmodelComponent?.struct_param || component.rawStructParam || {};
  const rawExtend = rawStruct.extendParams || rawStruct.extend_params || [];
  const coordinateKeys = new Set(['locCoordX', 'locCoordY', 'locCoordZ', 'locCoordROLL', 'locCoordPITCH', 'locCoordYAW']);
  const hasCoordinateValue = Array.isArray(rawExtend) && rawExtend.some((param: any) => coordinateKeys.has(param.key)
    && ['doubleValue', 'double_value', 'floatValue', 'float_value', 'int32Value', 'int32_value', 'int64Value', 'int64_value']
      .some(valueKey => Object.prototype.hasOwnProperty.call(param, valueKey)));
  return hasCoordinateValue
    || [component.mountX, component.mountY, component.mountZ, component.mountRoll, component.mountPitch, component.mountYaw].some(value => Number(value || 0) !== 0);
};

const positive = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

/**
 * View-only parking slots for components whose source pose is unresolved.
 * They are derived from the declared drive type and chassis envelope and are
 * never copied into ComponentConfig or export data.
 */
export const getUnresolvedWheelDisplayPose = (
  driveType: string,
  wheelCount: number,
  index: number,
  length: number,
  width: number,
  tyreWidth: number,
): WheelDisplayPose => {
  const outsideY = width / 2 + tyreWidth * 0.52;
  const slots = driveType === 'QUAD_STEER' || wheelCount >= 4
    ? [
      { x: length * 0.34, y: outsideY },
      { x: length * 0.34, y: -outsideY },
      { x: -length * 0.34, y: outsideY },
      { x: -length * 0.34, y: -outsideY },
    ]
    : driveType === 'DUAL_STEER'
      ? [{ x: length * 0.34, y: 0 }, { x: -length * 0.34, y: 0 }]
      : driveType === 'SINGLE_STEER'
        ? [{ x: 0, y: 0 }]
        : [{ x: 0, y: outsideY }, { x: 0, y: -outsideY }];
  const pose = slots[index % slots.length];
  const labels = WHEEL_SLOT_LABELS[driveType] || [];
  return { ...pose, z: 0, slot: labels[index] || `轮组 ${index + 1}` };
};

const markOverlayMaterial = (object: THREE.Object3D) => {
  object.traverse(child => {
    const renderable = child as THREE.Line;
    const materials = Array.isArray(renderable.material) ? renderable.material : renderable.material ? [renderable.material] : [];
    materials.forEach(material => {
      material.depthTest = false;
      material.transparent = true;
    });
    child.renderOrder = 20;
  });
};

const disposeObject = (root: THREE.Object3D) => {
  root.traverse(object => {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    materials.forEach(material => material.dispose());
  });
};

export const EquipmentWebGLScene: React.FC<Props> = ({
  config,
  components,
  selectedComponentId,
  cameraView,
  assemblyView,
  explodeUnresolved,
  zoomCommand,
  onSelectComponent,
  onCameraInteraction,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onSelectComponent, onCameraInteraction });
  const cameraViewRef = useRef(cameraView);
  const previousZoomCommandRef = useRef(zoomCommand);
  const runtimeRef = useRef<{
    setView: (view: EquipmentCameraView) => void;
    zoom: (direction: number) => void;
  } | null>(null);
  const [rendererState, setRendererState] = useState<'loading' | 'ready' | 'unsupported'>('loading');
  callbacksRef.current = { onSelectComponent, onCameraInteraction };
  cameraViewRef.current = cameraView;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    } catch {
      setRendererState('unsupported');
      return;
    }

    setRendererState('ready');
    renderer.setClearColor(0xbfc7c7, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.domElement.className = 'equipment-webgl-canvas';
    renderer.domElement.setAttribute('aria-label', 'AMR WebGL 三维装配场景');
    host.appendChild(renderer.domElement);

    const length = positive(config.identity.chassisLength) || 1;
    const width = positive(config.identity.chassisWidth) || 1;
    const height = positive(config.identity.chassisHeight) || 1;
    const maxPlan = Math.max(length, width);
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xbfc7c7, maxPlan * 3, maxPlan * 6.5);

    const perspective = new THREE.PerspectiveCamera(34, 1, Math.max(maxPlan / 5000, 0.01), maxPlan * 20);
    perspective.up.set(0, 0, 1);
    const orthographic = new THREE.OrthographicCamera(-1, 1, 1, -1, Math.max(maxPlan / 5000, 0.01), maxPlan * 20);
    orthographic.up.set(0, 0, 1);
    let activeCamera: THREE.Camera = cameraViewRef.current === 'iso' || cameraViewRef.current === 'free' ? perspective : orthographic;

    const controls = new OrbitControls(activeCamera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.screenSpacePanning = true;
    controls.minDistance = maxPlan * 0.35;
    controls.maxDistance = maxPlan * 8;
    controls.target.set(0, 0, height * 0.35);
    const interactionHandler = () => callbacksRef.current.onCameraInteraction?.();
    controls.addEventListener('start', interactionHandler);

    scene.add(new THREE.HemisphereLight(0xf4fbfb, 0x59666a, 2.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(length * 1.2, -width * 1.4, maxPlan * 2.1);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    const shadowExtent = maxPlan * 1.35;
    keyLight.shadow.camera.left = -shadowExtent;
    keyLight.shadow.camera.right = shadowExtent;
    keyLight.shadow.camera.top = shadowExtent;
    keyLight.shadow.camera.bottom = -shadowExtent;
    keyLight.shadow.camera.near = Math.max(maxPlan * 0.05, 0.1);
    keyLight.shadow.camera.far = maxPlan * 6;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);
    scene.add(keyLight.target);
    const rimLight = new THREE.DirectionalLight(0x89d8e6, 1.25);
    rimLight.position.set(-length, width, height * 2.5);
    scene.add(rimLight);

    const groundSize = maxPlan * 4.5;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(groundSize, groundSize),
      new THREE.MeshStandardMaterial({ color: 0xaeb8b8, roughness: 0.92, metalness: 0.02 }),
    );
    ground.position.z = -Math.max(maxPlan * 0.001, 0.2);
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(groundSize, 40, 0x52656a, 0x879496);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = 0;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.42;
    scene.add(grid);

    // The global triad is anchored at the actual vehicle origin. It renders on
    // top of the shell so the origin and +X/+Y/+Z directions remain auditable.
    const axes = new THREE.AxesHelper(maxPlan * 0.48);
    axes.position.set(0, 0, 0);
    markOverlayMaterial(axes);
    scene.add(axes);
    const origin = new THREE.Mesh(
      new THREE.SphereGeometry(maxPlan * 0.014, 18, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }),
    );
    origin.renderOrder = 21;
    scene.add(origin);

    const modelRoot = new THREE.Group();
    modelRoot.name = 'AMR_MODEL_ROOT';
    scene.add(modelRoot);

    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: assemblyView === 'wheel' ? 0x66777c : 0x39515a,
      metalness: 0.34,
      roughness: 0.48,
      transparent: true,
      opacity: CHASSIS_SHELL_OPACITY[assemblyView],
      depthWrite: false,
      side: THREE.FrontSide,
    });
    const chassisGeometry = config.identity.chassisShape === 'CYLINDER'
      ? new THREE.CylinderGeometry(Math.max(length, width) / 2, Math.max(length, width) / 2, height, 64)
      : new RoundedBoxGeometry(length, width, height, 6, Math.min(length, width, height) * 0.055);
    if (config.identity.chassisShape === 'CYLINDER') chassisGeometry.rotateX(Math.PI / 2);
    const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
    chassis.name = 'CHASSIS_ENVELOPE';
    chassis.position.z = height / 2;
    // Draw the transparent shell after opaque equipment. Disabling depth writes
    // keeps modules inside the envelope visible instead of being masked by it.
    chassis.renderOrder = 10;
    chassis.castShadow = false;
    chassis.receiveShadow = false;
    modelRoot.add(chassis);

    const chassisEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(chassisGeometry, 24),
      new THREE.LineBasicMaterial({
        color: 0xa9c2c6,
        transparent: true,
        opacity: assemblyView === 'transparent' ? 0.48 : assemblyView === 'wheel' ? 0.36 : 0.72,
        depthWrite: false,
      }),
    );
    chassisEdges.position.copy(chassis.position);
    chassisEdges.renderOrder = 11;
    modelRoot.add(chassisEdges);

    if (config.identity.chassisShape !== 'CYLINDER') {
      const deckThickness = Math.max(height * 0.018, maxPlan * 0.003);
      const serviceDeck = new THREE.Mesh(
        new RoundedBoxGeometry(length * 0.76, width * 0.68, deckThickness, 3, Math.min(length, width) * 0.025),
        new THREE.MeshStandardMaterial({
          color: 0x71858a,
          metalness: 0.46,
          roughness: 0.34,
          transparent: true,
          opacity: CHASSIS_DECK_OPACITY[assemblyView],
          depthWrite: false,
        }),
      );
      serviceDeck.position.z = height - deckThickness / 2 + maxPlan * 0.001;
      serviceDeck.renderOrder = 9;
      serviceDeck.castShadow = false;
      serviceDeck.receiveShadow = false;
      modelRoot.add(serviceDeck);
    }

    const frontMarker = new THREE.Mesh(
      new THREE.ConeGeometry(Math.max(width * 0.025, maxPlan * 0.009), Math.max(length * 0.065, maxPlan * 0.025), 4),
      new THREE.MeshStandardMaterial({ color: 0x31bfd3, emissive: 0x073c44, metalness: 0.25, roughness: 0.35 }),
    );
    frontMarker.rotation.z = -Math.PI / 2;
    frontMarker.position.set(length * 0.5, 0, height + maxPlan * 0.012);
    frontMarker.castShadow = true;
    modelRoot.add(frontMarker);

    const visibleComponents = components.filter(component => assemblyView !== 'wheel'
      || ['DRIVEWHEEL', 'DRIVER', 'DRIVE', 'MOTOR', 'ACTOR', 'SENSOR'].includes(component.category));
    const wheelComponents = visibleComponents.filter(component => classifyVisual(component) === 'wheel');
    let unresolvedIndex = 0;
    const selectableMeshes: THREE.Object3D[] = [];

    visibleComponents.forEach(component => {
      const kind = classifyVisual(component);
      const shape = component.shape;
      const shapeHasDimensions = Boolean(shape && (positive(shape.length) || positive(shape.width) || positive(shape.height) || positive(shape.diameter)));
      const fallbackUnit = maxPlan * 0.065;
      let geometry: THREE.BufferGeometry;
      let wheelRadius: number | undefined;
      let tyreWidth: number | undefined;

      if (kind === 'wheel') {
        // DRIVEWHEEL templates commonly expose a BOX envelope. In the project
        // coordinate convention the rolling plane is XZ and the axle is Y, so
        // envelope X/Z determine the visible diameter and Y determines width.
        const envelopeDiameter = Math.min(
          positive(shape?.length) || Number.POSITIVE_INFINITY,
          positive(shape?.height) || Number.POSITIVE_INFINITY,
        );
        wheelRadius = (positive(shape?.diameter) || (Number.isFinite(envelopeDiameter) ? envelopeDiameter : undefined) || fallbackUnit * 1.7) / 2;
        const sourceWidth = positive(shape?.width);
        const steeringText = `${component.type} ${component.subModuleTypeKey || ''}`.toLowerCase();
        const steering = config.identity.driveType.includes('STEER') || steeringText.includes('steer');
        tyreWidth = steering
          ? Math.min(sourceWidth || wheelRadius * 0.8, wheelRadius * 0.78)
          : sourceWidth || fallbackUnit * 0.68;
        geometry = new THREE.CylinderGeometry(wheelRadius, wheelRadius, tyreWidth, 40, 1);
      } else if (shape?.type === 'SPHERE') {
        geometry = new THREE.SphereGeometry((positive(shape.diameter) || fallbackUnit) / 2, 32, 18);
      } else if (shape?.type === 'CYLINDER') {
        geometry = new THREE.CylinderGeometry(
          (positive(shape.diameter) || fallbackUnit) / 2,
          (positive(shape.diameter) || fallbackUnit) / 2,
          positive(shape.height) || fallbackUnit,
          32,
        );
      } else {
        geometry = new THREE.BoxGeometry(
          positive(shape?.length) || fallbackUnit * 1.35,
          positive(shape?.width) || fallbackUnit,
          positive(shape?.height) || fallbackUnit * 0.7,
        );
      }

      const unresolved = !hasExplicitPose(component);
      const duplicateWheelPose = kind === 'wheel' && wheelComponents.filter(other => (
        Number(other.mountX || 0) === Number(component.mountX || 0)
        && Number(other.mountY || 0) === Number(component.mountY || 0)
        && Number(other.mountZ || 0) === Number(component.mountZ || 0)
      )).length > 1;
      const separateDuplicatePose = duplicateWheelPose && (assemblyView === 'wheel' || assemblyView === 'exploded' || explodeUnresolved);
      const needsAttention = unresolved || duplicateWheelPose;
      const selected = component.id === selectedComponentId;
      const material = new THREE.MeshStandardMaterial({
        color: needsAttention ? 0xd49d32 : selected ? 0x39d6e7 : CATEGORY_COLORS[kind],
        emissive: selected ? 0x0a4e58 : needsAttention ? 0x2f2105 : 0x000000,
        emissiveIntensity: selected || needsAttention ? 0.75 : 0,
        metalness: kind === 'wheel' ? 0.18 : 0.5,
        roughness: kind === 'wheel' ? 0.78 : 0.38,
        transparent: assemblyView === 'transparent' && kind !== 'wheel',
        opacity: assemblyView === 'transparent' && kind !== 'wheel' ? 0.9 : 1,
      });
      const componentRoot = new THREE.Group();
      componentRoot.name = `COMPONENT_FRAME:${component.alias || component.name}`;
      componentRoot.userData.componentId = component.id;
      componentRoot.userData.poseSource = unresolved ? 'view-staging' : separateDuplicatePose ? 'view-separated-duplicate' : 'source-pose';
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = component.alias || component.name;
      mesh.userData.componentId = component.id;
      mesh.userData.geometrySource = shapeHasDimensions ? 'source-shape' : 'view-fallback';
      mesh.userData.poseSource = unresolved ? 'view-staging' : 'source-pose';
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (kind === 'wheel' && wheelRadius) mesh.position.z = wheelRadius;
      componentRoot.add(mesh);

      if ((unresolved && (explodeUnresolved || assemblyView === 'exploded' || assemblyView === 'wheel' || kind === 'wheel')) || separateDuplicatePose) {
        const slot = unresolvedIndex++;
        if (kind === 'wheel') {
          const wheelIndex = wheelComponents.indexOf(component);
          const parking = getUnresolvedWheelDisplayPose(
            config.identity.driveType,
            wheelComponents.length,
            wheelIndex,
            length,
            width,
            tyreWidth || fallbackUnit,
          );
          componentRoot.position.set(parking.x, parking.y, parking.z);
          componentRoot.userData.slot = parking.slot;
        } else {
          const column = slot % 4;
          const row = Math.floor(slot / 4);
          componentRoot.position.set(-length * 0.42 + column * length * 0.28, width * 0.78 + row * fallbackUnit * 1.35, height + fallbackUnit * (1.3 + row));
        }
      } else {
        componentRoot.position.set(Number(component.mountX || 0), Number(component.mountY || 0), Number(component.mountZ || 0));
      }

      // Source R/P/Y rotates the component frame: Roll about local X, Pitch
      // about local Y and Yaw about local Z. Geometry-specific orientation is
      // contained below this frame and never changes the source coordinate axes.
      componentRoot.rotation.order = 'XYZ';
      componentRoot.rotation.x = THREE.MathUtils.degToRad(Number(component.mountRoll || 0));
      componentRoot.rotation.y = THREE.MathUtils.degToRad(Number(component.mountPitch || 0));
      componentRoot.rotation.z = THREE.MathUtils.degToRad(Number(component.mountYaw || 0));
      modelRoot.add(componentRoot);
      selectableMeshes.push(mesh);

      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 26),
        new THREE.LineBasicMaterial({ color: needsAttention ? 0xffd36a : selected ? 0xb9f8ff : 0x95a7aa, transparent: true, opacity: selected ? 1 : 0.55 }),
      );
      outline.position.copy(mesh.position);
      outline.userData.componentId = component.id;
      componentRoot.add(outline);
      selectableMeshes.push(outline);

      if (kind === 'wheel' && wheelRadius && tyreWidth) {
        const steeringText = `${component.type} ${component.subModuleTypeKey || ''}`.toLowerCase();
        const steering = config.identity.driveType.includes('STEER') || steeringText.includes('steer');
        const hub = new THREE.Mesh(
          new THREE.CylinderGeometry(wheelRadius * 0.4, wheelRadius * 0.4, tyreWidth * 1.08, 30),
          new THREE.MeshStandardMaterial({ color: 0x87969a, metalness: 0.72, roughness: 0.3 }),
        );
        hub.position.z = wheelRadius;
        hub.userData.componentId = component.id;
        hub.castShadow = true;
        componentRoot.add(hub);
        selectableMeshes.push(hub);

        if (steering) {
          const ringHeight = Math.max(wheelRadius * 0.18, maxPlan * 0.008);
          const ringZ = wheelRadius * 2.28;
          const turntable = new THREE.Mesh(
            new THREE.CylinderGeometry(wheelRadius * 0.72, wheelRadius * 0.72, ringHeight, 36),
            new THREE.MeshStandardMaterial({ color: needsAttention ? 0xc08a28 : 0x52676d, metalness: 0.58, roughness: 0.34 }),
          );
          turntable.rotation.x = Math.PI / 2;
          turntable.position.z = ringZ;
          turntable.userData.componentId = component.id;
          turntable.castShadow = true;
          componentRoot.add(turntable);
          selectableMeshes.push(turntable);

          const forkHeight = Math.max(ringZ - wheelRadius * 1.15, wheelRadius * 0.7);
          const forkThickness = Math.max(wheelRadius * 0.14, maxPlan * 0.006);
          [-1, 1].forEach(side => {
            const fork = new THREE.Mesh(
              new THREE.BoxGeometry(wheelRadius * 0.34, forkThickness, forkHeight),
              new THREE.MeshStandardMaterial({ color: 0x687a7f, metalness: 0.62, roughness: 0.32 }),
            );
            fork.position.set(0, side * (tyreWidth * 0.5 + forkThickness * 0.52), wheelRadius * 1.12 + forkHeight / 2);
            fork.userData.componentId = component.id;
            fork.castShadow = true;
            componentRoot.add(fork);
            selectableMeshes.push(fork);
          });

          const heading = new THREE.ArrowHelper(
            new THREE.Vector3(1, 0, 0),
            new THREE.Vector3(0, 0, ringZ + ringHeight),
            wheelRadius * 1.25,
            needsAttention ? 0xffc857 : 0x27c5d8,
            wheelRadius * 0.34,
            wheelRadius * 0.2,
          );
          heading.userData.componentId = component.id;
          markOverlayMaterial(heading);
          componentRoot.add(heading);
        }
      }

      if (selected) {
        const localAxes = new THREE.AxesHelper(maxPlan * 0.18);
        localAxes.name = 'SELECTED_COMPONENT_LOCAL_FRAME';
        markOverlayMaterial(localAxes);
        componentRoot.add(localAxes);
      }
    });

    if (assemblyView === 'exploded') {
      chassis.position.z += height * 0.32;
      chassisEdges.position.z += height * 0.32;
      frontMarker.position.z += height * 0.32;
    }

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const clickHandler = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, activeCamera);
      const hit = raycaster.intersectObjects(selectableMeshes, false)[0];
      const id = hit?.object.userData.componentId;
      const component = components.find(item => item.id === id);
      if (component) callbacksRef.current.onSelectComponent(component);
    };
    renderer.domElement.addEventListener('click', clickHandler);

    const setCameraPreset = (view: EquipmentCameraView, aspect: number) => {
      const target = new THREE.Vector3(0, 0, height * 0.38);
      if (view === 'iso' || view === 'free') {
        activeCamera = perspective;
        perspective.aspect = aspect;
        perspective.position.set(length * 1.75, -width * 2.3, Math.max(maxPlan * 1.55, height * 4.2));
        perspective.up.set(0, 0, 1);
        perspective.lookAt(target);
        perspective.updateProjectionMatrix();
        controls.object = perspective;
        controls.enableRotate = true;
      } else {
        activeCamera = orthographic;
        const horizontal = view === 'front' ? width : view === 'side' ? length : length;
        const vertical = view === 'top' ? width : height;
        const frustumHeight = Math.max(vertical * 1.45, horizontal * 1.45 / Math.max(aspect, 0.1), maxPlan * 0.3);
        orthographic.left = -frustumHeight * aspect / 2;
        orthographic.right = frustumHeight * aspect / 2;
        orthographic.top = frustumHeight / 2;
        orthographic.bottom = -frustumHeight / 2;
        orthographic.zoom = 1;
        if (view === 'top') {
          orthographic.position.set(0, 0, maxPlan * 3);
          orthographic.up.set(0, 1, 0);
          target.set(0, 0, 0);
        } else if (view === 'front') {
          orthographic.position.set(maxPlan * 3, 0, height * 0.5);
          orthographic.up.set(0, 0, 1);
          target.set(0, 0, height * 0.5);
        } else {
          orthographic.position.set(0, -maxPlan * 3, height * 0.5);
          orthographic.up.set(0, 0, 1);
          target.set(0, 0, height * 0.5);
        }
        orthographic.lookAt(target);
        orthographic.updateProjectionMatrix();
        controls.object = orthographic;
        controls.enableRotate = false;
      }
      controls.target.copy(target);
      controls.update();
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      const renderWidth = Math.max(Math.floor(bounds.width), 1);
      const renderHeight = Math.max(Math.floor(bounds.height), 1);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(renderWidth, renderHeight, false);
      setCameraPreset(cameraViewRef.current, renderWidth / renderHeight);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    runtimeRef.current = {
      setView: view => {
        const bounds = host.getBoundingClientRect();
        setCameraPreset(view, Math.max(bounds.width, 1) / Math.max(bounds.height, 1));
      },
      zoom: direction => {
        if (activeCamera instanceof THREE.OrthographicCamera) {
          activeCamera.zoom = Math.max(0.4, Math.min(3, activeCamera.zoom * (direction > 0 ? 1.18 : 0.84)));
          activeCamera.updateProjectionMatrix();
        } else {
          const offset = activeCamera.position.clone().sub(controls.target);
          offset.multiplyScalar(direction > 0 ? 0.84 : 1.18);
          activeCamera.position.copy(controls.target).add(offset);
        }
        controls.update();
      },
    };

    let animationFrame = 0;
    const animate = () => {
      controls.update();
      renderer.render(scene, activeCamera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.removeEventListener('start', interactionHandler);
      controls.dispose();
      renderer.domElement.removeEventListener('click', clickHandler);
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      runtimeRef.current = null;
      if (renderer.domElement.parentElement === host) host.removeChild(renderer.domElement);
    };
  }, [config.identity.chassisLength, config.identity.chassisWidth, config.identity.chassisHeight, config.identity.chassisShape, components, selectedComponentId, assemblyView, explodeUnresolved]);

  useEffect(() => {
    runtimeRef.current?.setView(cameraView);
  }, [cameraView]);

  useEffect(() => {
    if (zoomCommand !== previousZoomCommandRef.current) {
      runtimeRef.current?.zoom(zoomCommand > previousZoomCommandRef.current ? 1 : -1);
      previousZoomCommandRef.current = zoomCommand;
    }
  }, [zoomCommand]);

  return <div ref={hostRef} className="equipment-webgl-host">
    {rendererState === 'loading' && <div className="equipment-webgl-status">正在初始化 WebGL 场景…</div>}
    {rendererState === 'unsupported' && <div className="equipment-webgl-status equipment-webgl-error">浏览器无法创建 WebGL 上下文，请检查硬件加速设置。</div>}
    <div className="equipment-webgl-axis-labels" aria-hidden="true"><span className="axis-label-x">X 长度 / FRONT</span><span className="axis-label-y">Y 宽度</span><span className="axis-label-z">Z 高度</span></div>
  </div>;
};

export default EquipmentWebGLScene;
