import assert from 'node:assert/strict';
import { ExportService } from '../src/frontend/src/services/ExportService.js';
import { ImportService } from '../src/frontend/src/store/ImportService.js';

const source = {
  robotName: 'property-projection-fixture',
  moreModuleInfo: [{
    moduleGroupName: 'fixture-group',
    moduleGroupUuid: 'group-1',
    moduleComponets: [{
      generalAttr: {
        mainModuleType: { comboType: { typeKey: 'chassis' } },
        subModuleType: { comboType: { typeKey: 'fixtureChassis' } },
        moduleName: { type: 'DATA_STRING', stringValue: 'fixture-chassis' },
        moduleUuid: { type: 'DATA_STRING', stringValue: 'component-1' },
        moduleShape: {
          shapeType: 'ENUM_CYLINDER',
          cylinder: { diameter: 600, height: 120 },
        },
      },
      privateAttr: { privateAttrs: [{
        key: 'properties',
        desc: 'Properties',
        arrayBaseEle: [
          { key: 'fixedMode', type: 'DATA_FIXED_E', stringFix: 'MODE_A', fixedSource: ['fixture/source'] },
          { key: 'count', type: 'DATA_UINT32', uint32Value: 7 },
          { key: 'ratio', type: 'DATA_FLOAT', floatValue: 1.5 },
          { key: 'address', type: 'DATA_IP', ipValue: '192.168.1.10' },
        ],
      }] },
      interfaceParams: { interface_Group: [{
        key: 'CAN0', type: 'CAN', path: 'CAN0', desc: 'CAN bus', interfaceUuid: 'iface-1', linkedInterfaceUuid: [],
        linkAttrs: [{ key: 'termination', desc: '120 ohm' }],
        interfaceAttrs: { voltage: 24 },
        interfaceParams: { bitrate: 500000 },
      }] },
      structParam: { extendParams: [] },
    }],
  }],
};

const imported = ImportService.parseCompDesc(source) as any;
const component = imported.components[0];
const shape = component.shape;
assert.deepEqual(shape, { type: 'CYLINDER', diameter: 600, height: 120 });
assert.deepEqual(component.interfaces[0].linkAttrs, [{ key: 'termination', desc: '120 ohm' }]);
assert.deepEqual(component.interfaces[0].interfaceAttrs, { voltage: 24 });
assert.deepEqual(component.interfaces[0].interfaceParams, { bitrate: 500000 });

const fixed = component.privateAttrs[0].elements.find((item: any) => item.key === 'fixedMode');
assert.equal(fixed.value, 'MODE_A');
assert.deepEqual(fixed.fixedSource, ['fixture/source']);
assert.equal(component.privateAttrs[0].elements.find((item: any) => item.key === 'count').value, 7);
assert.equal(component.privateAttrs[0].elements.find((item: any) => item.key === 'ratio').value, 1.5);
assert.equal(component.privateAttrs[0].elements.find((item: any) => item.key === 'address').value, '192.168.1.10');

fixed.value = 'MODE_B';
const exported = ExportService.exportToCModel(imported);
const result = exported.moreModuleInfo[0].moduleComponets[0];
const exportedFixed = result.privateAttr.privateAttrs[0].arrayBaseEle.find((item: any) => item.key === 'fixedMode');
assert.equal(exportedFixed.stringFix, 'MODE_B');
assert.deepEqual(exportedFixed.fixedSource, ['fixture/source']);
assert.deepEqual(result.interfaceParams.interface_Group[0].interfaceAttrs, { voltage: 24 });
assert.deepEqual(result.interfaceParams.interface_Group[0].interfaceParams, { bitrate: 500000 });
assert.equal(result.generalAttr.moduleShape.cylinder.height, 120);

console.log('frontend_property_projection_regression: PASS');
