import { jest } from '@jest/globals';
import { ApplicationError } from '../../../libs/error.js';
import * as Types from '../../../libs/types/common.js';

/** @typedef {{ cloudinary: { uploader: { upload: jest.Mock } } }} CloudinaryLibMock */
/** @typedef {Record<keyof import('../upload.js'), jest.Mock>} UploadMiddlewareMock */
/** @typedef {Record<keyof import('../../../libs/multer.js'), jest.Mock>} MulterLibMock */

jest.unstable_mockModule(
  '../../../libs/cloudinary.js',
  () =>
    /** @type {CloudinaryLibMock} */
    ({ cloudinary: { uploader: { upload: jest.fn() } } })
);

jest.unstable_mockModule(
  '../../../libs/multer.js',
  () =>
    /** @type {MulterLibMock} */
    ({ uploadToMemory: jest.fn() })
);

const cloudinaryLib = /** @type {CloudinaryLibMock} */ (
  /** @type {unknown} */ (await import('../../../libs/cloudinary.js'))
);

const multerLib = /** @type {MulterLibMock} */ (
  await import('../../../libs/multer.js')
);

const uploadMiddleware = /** @type {UploadMiddlewareMock} */ (
  await import('../upload.js')
);

describe('Upload middleware', () => {
  describe('Parse image', () => {
    it('passes the middleware and parse the image successfully', () => {
      multerLib.uploadToMemory.mockImplementation(
        /** @type {Types.Middleware} */
        // @ts-ignore
        (_req, _res, next) => next()
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {}
      };

      const mockNext = jest.fn();

      uploadMiddleware.parseImage(mockRequest, mockResponse, mockNext);

      // expect(mockResponse.locals).toEqual({ image: 'Emilia' });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('throws application error when parsing fails', () => {
      multerLib.uploadToMemory.mockImplementation(
        /** @type {Types.Middleware} */
        // @ts-ignore
        (_req, _res, next) => next(new ApplicationError('Parsing failed', 500))
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      uploadMiddleware.parseImage(mockRequest, mockResponse, mockNext);

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Error while parsing file: Parsing failed'
      });
    });

    it('throws non generic error when parsing fails', () => {
      multerLib.uploadToMemory.mockImplementation(
        /** @type {Types.Middleware} */
        // @ts-ignore
        (_req, _res, next) => next('Parsing failed')
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      uploadMiddleware.parseImage(mockRequest, mockResponse, mockNext);

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });

  describe('Upload cloudinary', () => {
    it('passes the middleware and upload the image successfully', async () => {
      const mockImageLink = 'https://example.com/image.png';

      cloudinaryLib.cloudinary.uploader.upload.mockResolvedValue(
        // @ts-ignore
        { secure_url: mockImageLink }
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await uploadMiddleware.uploadCloudinary(
        mockRequest,
        mockResponse,
        mockNext
      );

      const fileBase64 = mockRequest.file.buffer.toString('base64');
      const file = `data:${mockRequest.file.mimetype};base64,${fileBase64}`;

      expect(cloudinaryLib.cloudinary.uploader.upload).toHaveBeenCalledWith(
        file
      );

      expect(mockResponse.locals).toEqual({ image: mockImageLink });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('passes the middleware and set image to null when no image is uploaded', async () => {
      const mockRequest = {
        file: undefined
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await uploadMiddleware.uploadCloudinary(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({ image: null });
      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it('throws application error when upload fails', async () => {
      const mockError = new ApplicationError('Upload failed', 500);

      cloudinaryLib.cloudinary.uploader.upload.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await uploadMiddleware.uploadCloudinary(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(mockError.statusCode);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: `Error while uploading file: ${mockError.message}`
      });
    });

    it('throws generic error from cloudinary when upload fails', async () => {
      const mockError = new Error('Upload failed');

      cloudinaryLib.cloudinary.uploader.upload.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await uploadMiddleware.uploadCloudinary(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: `Error while uploading file: ${mockError.message}`
      });
    });

    it('throws non generic error when upload fails', async () => {
      const mockError = 'Upload failed';

      cloudinaryLib.cloudinary.uploader.upload.mockRejectedValue(
        // @ts-ignore
        mockError
      );

      const mockRequest = {
        file: {
          buffer: Buffer.from('Emilia'),
          mimetype: 'image/png',
          toString: jest.fn().mockReturnValue('Emilia')
        }
      };

      const mockResponse = {
        locals: {},
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const mockNext = jest.fn();

      await uploadMiddleware.uploadCloudinary(
        mockRequest,
        mockResponse,
        mockNext
      );

      expect(mockResponse.locals).toEqual({});

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});
