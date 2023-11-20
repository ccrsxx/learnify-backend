import { uploadToMemory } from '../../libs/multer.js';
import { isAdmin } from './auth.js';
import { cloudinary } from '../../libs/cloudinary.js';
import * as Types from '../../libs/types/common.js';

/**
 * Parse image from request body
 *
 * @type {Types.Middleware<Types.ExtractLocalsMiddleware<typeof isAdmin>>}
 * @returns {void}
 */
export function parseImage(req, res, next) {
  uploadToMemory(req, res, (err) => {
    if (err) {
      if (err instanceof Error) {
        res.status(500).json({
          message: `Error while parsing file: ${err.message}`
        });

        return;
      }

      res.status(500).json({
        message: 'Internal server error'
      });

      return;
    }

    next();
  });
}

/**
 * Upload image to cloudinary
 *
 * @type {Types.Middleware<
 *   Types.ExtractLocalsMiddleware<typeof parseImage> & { image: string | null }
 * >}
 * @returns {Promise<void>}
 */
export async function uploadCloudinary(req, res, next) {
  const imageFromRequest = req.file;

  if (!imageFromRequest) {
    res.locals.image = null;

    next();
    return;
  }

  const fileBase64 = imageFromRequest.buffer.toString('base64');
  const file = `data:${imageFromRequest.mimetype};base64,${fileBase64}`;

  try {
    const { secure_url } = await cloudinary.uploader.upload(file);

    res.locals.image = secure_url;
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({
        message: `Error while uploading file: ${err.message}`
      });

      return;
    }

    res.status(500).json({
      message: 'Internal server error'
    });

    return;
  }

  next();
}
