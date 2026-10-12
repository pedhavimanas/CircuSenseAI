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

    def test_05_ocr_engine_verification(self):
        from backend.ocr import get_tesseract_info, configure_tesseract
        import pytesseract

        self.assertTrue(configure_tesseract(), "Failed to configure Tesseract OCR engine")
        info = get_tesseract_info()
        self.assertTrue(info["available"], f"Tesseract not available: {info}")
        self.assertIsNotNone(info["version"], "Tesseract version is None")
        self.assertIn("eng", info["languages"], f"English language pack missing: {info['languages']}")
        print(f"OCR engine verified: version={info['version']}, langs={info['languages']}")

        # Test on clean synthetic text image (TEST123)
        img = Image.new("RGB", (300, 80), color=(255, 255, 255))
        draw = ImageDraw.Draw(img)
        # Use standard text drawing
        draw.text((20, 25), "TEST123", fill=(0, 0, 0))
        # Enlarge for clean recognition
        scaled_img = img.resize((600, 160), Image.Resampling.NEAREST)
        recognized = pytesseract.image_to_string(
            scaled_img.convert("L"),
            config="--psm 7"
        ).strip()
        self.assertIn("TEST123", recognized, f"Expected 'TEST123' in OCR output, got '{recognized}'")
        print(f"Synthetic text OCR test PASSED: recognized='{recognized}'")

    def test_06_pcb_pipeline_ocr_disabled(self):
        sample_path = "public/assets/sample-pcb.png"
        if not os.path.exists(sample_path):
            sample_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "assets", "sample-pcb.png")
        self.assertTrue(os.path.exists(sample_path), f"Sample PCB image not found at {sample_path}")

        with open(sample_path, "rb") as f:
            res = self.client.post(
                "/api/detect-pcb",
                files={"image": ("sample-pcb.png", f, "image/png")},
                data={"confidence_threshold": "0.20", "run_ocr": "false"}
            )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        detections = data["detections"]
        summary = data["summary"]
        self.assertGreater(len(detections), 0)
        self.assertEqual(summary["ocrReadableCount"], 0)
        for det in detections:
            self.assertEqual(det["ocr"]["status"], "not_attempted")
            self.assertIsNone(det["ocr"]["text"])
        print(f"PCB pipeline without OCR PASSED: {len(detections)} detections, all 'not_attempted'.")

    def test_07_pcb_pipeline_ocr_enabled(self):
        sample_path = "public/assets/sample-pcb.png"
        if not os.path.exists(sample_path):
            sample_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "assets", "sample-pcb.png")
        self.assertTrue(os.path.exists(sample_path), f"Sample PCB image not found at {sample_path}")

        with open(sample_path, "rb") as f:
            res = self.client.post(
                "/api/detect-pcb",
                files={"image": ("sample-pcb.png", f, "image/png")},
                data={"confidence_threshold": "0.20", "run_ocr": "true"}
            )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        detections = data["detections"]
        summary = data["summary"]
        self.assertGreater(len(detections), 0)

        # Count OCR statuses
        status_counts = {}
        detected_samples = []
        for det in detections:
            st = det["ocr"]["status"]
            status_counts[st] = status_counts.get(st, 0) + 1
            if st == "detected" and det["ocr"]["text"]:
                detected_samples.append((det["id"], det["className"], det["ocr"]["text"]))

        self.assertEqual(summary["ocrReadableCount"], status_counts.get("detected", 0))
        # Ensure OCR was actually attempted on all crops
        self.assertEqual(status_counts.get("not_attempted", 0), 0)
        print(f"PCB pipeline with OCR PASSED: Total detections={len(detections)}, OCR status counts={status_counts}")
        print(f"Readable markings count: {summary['ocrReadableCount']}")
        if detected_samples:
            print(f"Sample detected markings: {detected_samples[:5]}")


if __name__ == "__main__":
    unittest.main()
