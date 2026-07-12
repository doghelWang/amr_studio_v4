import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.compile_service import _collect_module_rows, _normalize_io_category


class CompileServiceTests(unittest.TestCase):
    def test_normalize_io_category_maps_interface_like_categories(self):
        self.assertEqual(_normalize_io_category("SAFETY_INTERFACE"), "IO")
        self.assertEqual(_normalize_io_category("IOMODULE_COMMON"), "IO")
        self.assertEqual(_normalize_io_category("IO_BOARD"), "IO")
        self.assertEqual(_normalize_io_category("DRIVEWHEEL"), "DRIVEWHEEL")

    def test_collect_module_rows_uses_explicit_types_and_coordinates(self):
        rows = []
        _collect_module_rows(
            {
                "module_componets": [
                    {
                        "generalAttr": {
                            "moduleName": {"stringValue": "Main Controller"},
                            "mainModuleType": {"comboType": {"typeKey": "mainCPU", "typeDesc": "核心主控"}},
                            "subModuleType": {"comboType": {"typeKey": "subMainCPU", "typeDesc": "主控子类"}},
                            "subSysType": {"comboType": {"typeKey": "ControlSys", "typeDesc": "控制系统"}},
                        },
                        "structParam": {
                            "extendParams": [
                                {"key": "locCoordX", "doubleValue": 1},
                                {"key": "locCoordY", "doubleValue": 2},
                                {"key": "locCoordZ", "doubleValue": 3},
                                {"key": "locCoordROLL", "doubleValue": 4},
                                {"key": "locCoordPITCH", "doubleValue": 5},
                                {"key": "locCoordYAW", "doubleValue": 6},
                            ]
                        },
                    }
                ]
            },
            rows,
        )

        self.assertEqual(
            rows,
            [
                {
                    "模块名": "Main Controller",
                    "所属子系统": "控制系统",
                    "子系统Key": "ControlSys",
                    "模块主类别": "核心主控",
                    "主类别Key": "mainCPU",
                    "子类别": "主控子类",
                    "子类别Key": "subMainCPU",
                    "安装位置(X/Y/Z)": "1/2/3",
                    "旋转姿态(R/P/Y)": "4/5/6",
                }
            ],
        )

    def test_collect_module_rows_falls_back_from_module_type_mapping_and_recurses(self):
        rows = []
        _collect_module_rows(
            {
                "module_componets": [
                    {
                        "generalAttr": {
                            "moduleName": {"stringValue": "IO Board"},
                            "moduleType": {"stringValue": "IO_BOARD"},
                        },
                        "structParam": {"extendParams": []},
                    }
                ],
                "moreModuleInfo": [
                    {
                        "module_componets": [
                            {
                                "generalAttr": {
                                    "module_name": {"string_value": "Child Wheel"},
                                    "module_type": {"string_value": "wheel-subtype"},
                                },
                                "category": "DRIVEWHEEL",
                                "struct_param": {
                                    "extend_params": [
                                        {"key": "locCoordX", "double_value": 7},
                                        {"key": "locCoordY", "double_value": 8},
                                    ]
                                },
                            }
                        ]
                    }
                ],
            },
            rows,
        )

        self.assertEqual(len(rows), 2)
        self.assertEqual(rows[0]["模块主类别"], "接口扩展模块")
        self.assertEqual(rows[0]["主类别Key"], "extendedlnterface")
        self.assertEqual(rows[0]["子类别"], "IO_BOARD")
        self.assertEqual(rows[0]["安装位置(X/Y/Z)"], "0/0/0")
        self.assertEqual(rows[1]["模块名"], "Child Wheel")
        self.assertEqual(rows[1]["模块主类别"], "驱动轮")
        self.assertEqual(rows[1]["主类别Key"], "driveWheel")
        self.assertEqual(rows[1]["子类别"], "wheel-subtype")
        self.assertEqual(rows[1]["安装位置(X/Y/Z)"], "7/8/0")


if __name__ == "__main__":
    unittest.main()
