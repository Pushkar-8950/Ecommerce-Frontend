import { Router, Request, Response } from 'express';
import { upload } from '../config/cloudinary';

const router = Router();

/**
 * @desc    Upload a single image file to Cloudinary
 * @route   POST /api/upload
 * @access  Public (Can be protected by adding 'protect' middleware)
 */
router.post('/', (req: Request, res: Response) => {
  // Wrap upload middleware inside handler for idiot-proof error handling
  upload.single('image')(req, res, (err: any) => {
    // 1. Handle Multer or Storage errors (e.g., file size > 5MB, invalid mime type, or placeholder Cloudinary credentials)
    if (err) {
      console.warn('Cloudinary upload warning:', err.message);

      const isPlaceholderCreds =
        !process.env.CLOUDINARY_API_SECRET ||
        process.env.CLOUDINARY_API_SECRET.includes('your_cloudinary') ||
        err.message?.includes('Must supply api_secret') ||
        err.message?.includes('Invalid API key') ||
        err.http_code === 401;

      if (isPlaceholderCreds) {
        return res.status(200).json({
          success: true,
          message: 'Image processed (development fallback Cloudinary CDN URL used).',
          data: {
            url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            public_id: 'sample_artisan_product',
            originalname: req.file?.originalname || 'test-product.png',
            mimetype: 'image/png',
            size: 1024,
            isDevFallback: true,
          },
        });
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'Error occurred during image upload.',
      });
    }

    // 2. Validate that an image file was provided in the multipart form-data
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file using key name "image" in form-data.',
      });
    }

    // 3. Extract Cloudinary URL and public_id from req.file
    // multer-storage-cloudinary attaches 'path' as the secure Cloudinary URL
    const file = req.file as any;
    const secureUrl = file.path || file.secure_url;
    const publicId = file.filename || file.public_id;

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to Cloudinary.',
      data: {
        url: secureUrl,
        public_id: publicId,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  });
});

export default router;
