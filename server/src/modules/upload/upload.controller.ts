import { Request, Response } from "express";
import cloudinary from "../../config/cloudinary";

export class UploadController {
  /**
   * POST /api/upload/image
   * Upload image to Cloudinary (supports multipart form file or base64 JSON payload)
   */
  static async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const file = (req as any).file;
      // 1. Check if uploaded via multer (file in buffer)
      if (file) {
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;

        const uploadResult = await cloudinary.uploader.upload(dataURI, {
          folder: "tikora/tickets",
          resource_type: "image",
        });

        res.status(200).json({
          success: true,
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
        return;
      }

      // 2. Check if sent as base64 / data URL in JSON body
      const { image, dataUrl } = req.body;
      const targetImage = image || dataUrl;

      if (!targetImage) {
        res.status(400).json({
          success: false,
          message: "No image file or base64 image data provided.",
        });
        return;
      }

      const uploadResult = await cloudinary.uploader.upload(targetImage, {
        folder: "tikora/tickets",
        resource_type: "image",
      });

      res.status(200).json({
        success: true,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      });
    } catch (error: any) {
      console.error("Cloudinary image upload error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Failed to upload image to Cloudinary.",
      });
    }
  }
}
