from backend.core.model_parser import ModelParser
import json

def test():
    result = ModelParser.parse_modelset('/Users/wangfeifei/code/amr_studio_v4/docs/ModelSet312.cmodel')
    print("SUCCESS!")
    print(f"Found {len(result['config']['wheels'])} wheels")
    print(f"Found {len(result['config']['sensors'])} sensors")
    print(f"Found {len(result['config']['ioBoards'])} ioBoards")
    print(f"Found {len(result['config']['ioPorts'])} ioPorts (Linked Logic)")
    print(f"MCU: {result['config']['mcu']['id']}")
    
    with open('/tmp/final_model_test.json', 'w') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    test()
