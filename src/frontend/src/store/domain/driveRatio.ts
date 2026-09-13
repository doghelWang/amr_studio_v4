import type { ComponentConfig, RobotConfig } from '../types';
import { buildAttributesFromSchema } from '../SchemaEngine';

export interface DriveRatioProjection {
    motorReductionRatio?: number;
    steeringGearRatio?: number;
    totalSteeringRatio?: number;
    backendBindings: {
        motorReductionKey: 'gearRatio';
        steeringGearKey: 'gearRatio';
    };
}

function findAttribute(groups: any[] = [], key: string): any {
    for (const group of groups) {
        for (const element of group.elements || []) {
            if (element.key === key) return element;
            for (const option of element.comboType?.typeGroups || []) {
                const nested = findAttribute([{ elements: option.arrayCmobEle || [] }], key);
                if (nested) return nested;
            }
        }
    }
    return undefined;
}

function readNumber(attribute: any): number | undefined {
    const value = attribute?.value ?? attribute?.doubleValue ?? attribute?.int32Value;
    return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readReference(attribute: any): string | undefined {
    const value = attribute?.value ?? attribute?.stringValue;
    return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function readActiveFeedbackAttribute(wheel: ComponentConfig, key: string): any {
    const groups = wheel.privateAttrs.some(group => group.elements?.length > 0)
        ? wheel.privateAttrs
        : buildAttributesFromSchema(wheel.type || wheel.subModuleTypeKey || '');
    const sensor = findAttribute(groups, 'angleSensorType');
    const sensorType = sensor?.comboType?.typeKey || sensor?.value;
    const activeGroup = (sensor?.comboType?.typeGroups || []).find((group: any) => group.key === sensorType);
    return findAttribute([{ elements: activeGroup?.arrayCmobEle || [] }], key);
}

/**
 * Projects frontend role semantics onto the two backend ratio attributes.
 * The derived total is intentionally not serialized as a new backend field.
 */
export function projectDriveRatio(config: RobotConfig, wheel: ComponentConfig): DriveRatioProjection {
    const groups = wheel.privateAttrs.some(group => group.elements?.length > 0)
        ? wheel.privateAttrs
        : buildAttributesFromSchema(wheel.type || wheel.subModuleTypeKey || '');
    const steeringMotorId = readReference(findAttribute(groups, 'relateRotMotor'));
    const steeringMotor = config.components.find(component => component.id === steeringMotorId);
    const motorReductionRatio = readNumber(findAttribute(steeringMotor?.privateAttrs, 'gearRatio'));
    const steeringGearRatio = readNumber(readActiveFeedbackAttribute(wheel, 'gearRatio'));

    return {
        motorReductionRatio,
        steeringGearRatio,
        totalSteeringRatio: motorReductionRatio !== undefined && steeringGearRatio !== undefined
            ? motorReductionRatio * steeringGearRatio
            : undefined,
        backendBindings: {
            motorReductionKey: 'gearRatio',
            steeringGearKey: 'gearRatio'
        }
    };
}
