import io
import sys
import os
import unittest
from PIL import Image, ImageDraw

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from backend.app import app

class TestCircuSenseBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Trigger startup event / lifespan
        cls.client = TestClient(app)
        # Hit health to trigger model load
        res = cls.client.get("/api/health")
        cls.health_data = res.json()

    def test_01_health(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertTrue(data["modelLoaded"])
        self.assertEqual(data["modelClasses"], 22)
        print(f"Health check PASSED: {data}")

    def test_02_model_info(self):
        res = self.client.get("/api/model-info")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["classCount"], 22)
        self.assertEqual(len(data["classes"]), 22)
        # Verify several key classes
        self.assertIn("capacitor", data["classes"].values())
        self.assertIn("resistor", data["classes"].values())
        self.assertIn("ic", data["classes"].values())
        self.assertIn("diode", data["classes"].values())
        print(f"Model info check PASSED: 22 classes present.")

    def test_03_invalid_image(self):
        # Send text file instead of image
        fake_file = io.BytesIO(b"not an image")
        res = self.client.post(
            "/api/detect-pcb",
            files={"image": ("test.txt", fake_file, "text/plain")}
        )
        self.assertEqual(res.status_code, 400)
        print(f"Invalid image correctly rejected with status 400.")

    def test_04_inference_on_sample_image(self):
        # Create a test PCB-like image
        img = Image.new("RGB", (640, 480), color=(18, 55, 30))
        draw = ImageDraw.Draw(img)
        # Draw some rectangles that could resemble components
        draw.rectangle([50, 50, 120, 100], fill=(20, 20, 20), outline=(200, 200, 200))
        draw.rectangle([200, 150, 240, 180], fill=(180, 150, 50), outline=(100, 100, 100))
        
        buf = io.BytesIO()
        img.save(buf, format="JPEG")
        buf.seek(0)

        res = self.client.post(
            "/api/detect-pcb",
            files={"image": ("test_board.jpg", buf, "image/jpeg")},
            data={"confidence_threshold": "0.10"}
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("detections", data)
        self.assertIn("summary", data)
        self.assertIn("timing", data)
        self.assertGreaterEqual(data["timing"]["inferenceMs"], 0)
        print(f"Inference execution PASSED. Detections returned: {len(data['detections'])}. Inference time: {data['timing']['inferenceMs']}ms")

if __name__ == "__main__":
    unittest.main()
