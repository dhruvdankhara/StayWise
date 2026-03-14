import type { Request, Response } from 'express';

import { cloudinary } from '../../config/cloudinary';
import { sendSuccess } from '../../utils/api';
import { AppError } from '../../utils/AppError';
import { asyncHandler } from '../../utils/asyncHandler';

export const uploadAsset = asyncHandler(async (request: Request, response: Response) => {
  const file = request.file;

  if (!file) {
    throw new AppError(400, 'File upload is required');
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    sendSuccess(
      response,
      {
        url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        filename: file.originalname,
        size: file.size
      },
      'Upload processed in development mode'
    );
    return;
  }

  const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
    folder: 'staywise'
  });

  sendSuccess(response, result, 'Upload successful', 201);
});
