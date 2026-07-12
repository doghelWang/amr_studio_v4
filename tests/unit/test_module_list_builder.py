import sys
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = REPO_ROOT / "src" / "backend"
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.services.module_list_builder import build_module_row, collect_module_rows, normalize_io_category


class ModuleListBuilderTests(unittest.TestCase):
    def test_normalize_io_category(self):
        self.assertEqual(normalize_io_category("IO_BOARD"), "IO")
        self.assertEqual(normalize_io_category("SAFETY_INTERFACE"), "IO")
        self.assertEqual(normalize_io_category("BATTERY"), "BATTERY")

    def test_build_module_row_extracts_explicit_and_default_fields(self):
        row = build_module_row(
            {
                "generalAttr": {
                    "moduleName": {"stringValue": "Battery"},
                    "mainModuleType": {"comboType": {"typeKey": "battery", "typeDesc": "能量电池"}},
                    "subSysType": {"comboType": {"typeKey": "EnergySys", "typeDesc": "能量系统"}},
                },
                "type": "BatterySubtype",
                "structParam": {"extendParams": [{"key": "locCoordX", "doubleValue": 9}]},
            }
        )

        self.assertEqual(row["模块名"], "Battery")
        self.assertEqual(row["模块主类别"], "能量电池")
        self.assertEqual(row["主类别Key"], "battery")
        self.assertEqual(row["所属子系统"], "能量系统")
        self.assertEqual(row["子系统Key"], "EnergySys")
        self.assertEqual(row["子类别"], "BatterySubtype")
        self.assertEqual(row["安装位置(X/Y/Z)"], "9/0/0")
        self.assertEqual(row["旋转姿态(R/P/Y)"], "0/0/0")

    def test_collect_module_rows_recurses_children(self):
        rows = []
        collect_module_rows(
            {
                "module_componets": [{"generalAttr": {"moduleName": {"stringValue": "Root"}, "moduleType": {"stringValue": "MAINCPU"}}}],
                "moreModuleInfo": [
                    {
                        "module_componets": [
                            {"generalAttr": {"moduleName": {"stringValue": "Child"}, "moduleType": {"stringValue": "SENSOR"}}}
                        ]
                    }
                ],
            },
            rows,
        )

        self.assertEqual([row["模块名"] for row in rows], ["Root", "Child"])


if __name__ == "__main__":
    unittest.main()
