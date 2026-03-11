import sys
import os
import json
import unittest

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.core.protobuf_engine import generate_industrial_modelset
from backend.core.model_parser import ModelParser
from backend.schemas.api import GeneratePayload

class TestRoundTrip(unittest.TestCase):
    """
    Validates that a project configuration can be converted to .model
    and back to JSON without loss of critical physical parameters.
    """

    def test_full_roundtrip(self):
        # 1. Create a complex payload
        payload_dict = {
            "robotName": "Audit_Robot_V4",
            "version": "4.2",
            "driveType": "QUAD_STEER",
            "wheels": [
                {
                    "id": "w1", "label": "Wheel 1", "mountX": 500.5, "mountY": 400.2, "mountYaw": 0,
                    "orientation": "FRONT_LEFT", "driverModel": "ELMO", "canBus": "CAN0", "canNodeId": 1,
                    "motorPolarity": "FORWARD", "zeroPos": 0, "leftLimit": -90, "rightLimit": 90,
                    "headOffsetIdle": 110.1, "tailOffsetIdle": 110.2, "leftOffsetIdle": 110.3, "rightOffsetIdle": 110.4,
                    "maxVelocityIdle": 1500, "maxAccIdle": 800, "maxDecIdle": 800,
                    "headOffsetFull": 220.1, "tailOffsetFull": 220.2, "leftOffsetFull": 220.3, "rightOffsetFull": 220.4,
                    "maxVelocityFull": 1200, "maxAccFull": 500, "maxDecFull": 500
                },
                {
                    "id": "w2", "label": "Wheel 2", "mountX": -500.5, "mountY": -400.2, "mountYaw": 0,
                    "orientation": "REAR_RIGHT", "driverModel": "ELMO", "canBus": "CAN0", "canNodeId": 2,
                    "motorPolarity": "FORWARD", "zeroPos": 0, "leftLimit": -90, "rightLimit": 90,
                    "headOffsetIdle": 110.1, "tailOffsetIdle": 110.2, "leftOffsetIdle": 110.3, "rightOffsetIdle": 110.4,
                    "maxVelocityIdle": 1500, "maxAccIdle": 800, "maxDecIdle": 800,
                    "headOffsetFull": 220.1, "tailOffsetFull": 220.2, "leftOffsetFull": 220.3, "rightOffsetFull": 220.4,
                    "maxVelocityFull": 1200, "maxAccFull": 500, "maxDecFull": 500
                }
            ],
            "sensors": [
                {
                    "id": "s1", "type": "LASER_2D", "model": "SICK", "usageNavi": True, "usageObs": True,
                    "mountX": 600.0, "mountY": 0.0, "mountZ": 300.0, "mountYaw": 0.0, "mountPitch": 0.0, "mountRoll": 0.0
                }
            ],
            "ioPorts": []
        }
        payload = GeneratePayload(**payload_dict)

        # 2. Generate ModelSet (JSON -> .model)
        zip_path = generate_industrial_modelset(payload)
        self.assertTrue(os.path.exists(zip_path))

        # 3. Parse ModelSet back ( .model -> JSON)
        reconstructed_project = ModelParser.parse_modelset(zip_path)
        recon_config = reconstructed_project["config"]

        # 4. Assertions for Parity
        self.assertEqual(recon_config["identity"]["robotName"], "Audit_Robot_V4")
        self.assertEqual(recon_config["identity"]["driveType"], "QUAD_STEER")
        
        # Check Wheels
        self.assertEqual(len(recon_config["wheels"]), 2)
        self.assertAlmostEqual(recon_config["wheels"][0]["mountX"], 500.5, places=1)
        self.assertAlmostEqual(recon_config["wheels"][0]["headOffsetIdle"], 110.1, places=1)
        self.assertAlmostEqual(recon_config["wheels"][0]["headOffsetFull"], 220.1, places=1)
        
        # Check Sensors
        self.assertEqual(len(recon_config["sensors"]), 1)
        self.assertAlmostEqual(recon_config["sensors"][0]["mountZ"], 300.0, places=1)

        print("\n✅ Round-trip parity test PASSED.")

if __name__ == "__main__":
    unittest.main()
