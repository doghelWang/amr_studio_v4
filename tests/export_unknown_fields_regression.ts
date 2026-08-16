import assert from 'node:assert/strict';
import { ExportService } from '../src/frontend/src/services/ExportService.js';
import { ImportService } from '../src/frontend/src/store/ImportService.js';

const source = {
  robotName: 'preservation-fixture',
  moreModuleInfo: [{
    moduleGroupName: 'controller-group',
    moduleGroupUuid: 'group-1',
    moduleComponets: [{
      generalAttr: {
        moduleName: { type: 'DATA_STRING', stringValue: 'controller-1', boolParse: true },
        moduleUuid: { type: 'DATA_STRING', stringValue: 'component-1', boolParse: true },
        moduleVendorExtension: { vendorKey: 'must-survive' }
      },
      privateAttr: {
        privateAttrs: [{
          key: 'electrical',
          desc: 'Electrical',
          arrayBaseEle: [{
            key: 'baudRate',
            type: 'DATA_INT32',
            int32Value: 500000,
            vendorAttribute: 'must-survive'
          }]
        }]
      },
      interfaceParams: {
        interfaceGroup: [{
          key: 'can0',
          type: 'CAN',
          path: 'CAN0',
          interfaceUuid: 'interface-1',
          linkedInterfaceUuid: [],
          electricalExtension: { impedance: 120 }
        }]
      },
      structParam: {
        extendParams: [{ key: 'locCoordX', type: 'DATA_DOUBLE', doubleValue: 1 }],
        vendorStructExtension: { checksum: 'must-survive' }
      }
    }]
  }]
};

const imported = ImportService.parseCompDesc(source) as any;
const component = imported.components[0];
component.name = 'controller-renamed';
component.mountX = 42;
component.interfaces[0].linkedInterfaceUuid = ['interface-2'];

const exported = ExportService.exportToCModel(imported);
const result = exported.moreModuleInfo[0].moduleComponets[0];

assert.equal(result.generalAttr.moduleName.stringValue, 'controller-renamed');
assert.equal(result.generalAttr.moduleVendorExtension.vendorKey, 'must-survive');
assert.equal(result.privateAttr.privateAttrs[0].arrayBaseEle[0].vendorAttribute, 'must-survive');
assert.equal(result.interfaceParams.interfaceGroup[0].electricalExtension.impedance, 120);
assert.deepEqual(result.interfaceParams.interfaceGroup[0].linkedInterfaceUuid, ['interface-2']);
assert.equal(result.structParam.vendorStructExtension.checksum, 'must-survive');
assert.equal(result.structParam.extendParams.find((p: any) => p.key === 'locCoordX').doubleValue, 42);

console.log('export_unknown_fields_regression: PASS');
