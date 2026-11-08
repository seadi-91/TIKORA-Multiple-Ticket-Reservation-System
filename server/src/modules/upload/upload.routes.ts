import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

router.post("/image", upload.single("image"), UploadController.uploadImage);

export default router;

