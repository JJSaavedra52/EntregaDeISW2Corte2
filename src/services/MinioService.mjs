import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import { Boom } from '@hapi/boom';
import { MINIO_ACCESS_KEY, MINIO_HOST, MINIO_SECRET_KEY } from '../commons/env.mjs';
import { BUCKET_NAME } from '../commons/constants.mjs';

class MinioService {
  conn = null;

  constructor() {
    if (!this.conn) {
      this.conn = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: MINIO_ACCESS_KEY,
          secretAccessKey: MINIO_SECRET_KEY,
        },
        enpoint: MINIO_HOST,
        forcePathStyle: true,
      });
    }
  }

  async saveImage(image) {
    try {
      if (!image) {
        throw Boom.badRequest('Image is required');
      }

      if (!image.originalname) {
        throw Boom.badRequest('Image original name is required');
      }

      if (!image.buffer) {
        throw Boom.badRequest('Image buffer is required');
      }

      const { originalname, buffer } = image;

      const originalNameParts = originalname.split('.');

      if (originalNameParts.length !== 2) {
        throw Boom.badRequest('Invalid image name');
      }
      const extension = originalNameParts[1];

      const fileName = `${v4()}.${extension}`;

      await this.conn.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Buffer: buffer,
      }));

      return fileName;
    } catch (error) {
      throw Boom.isBoom(error) ? error
        : Boom.internal('Error saving images', error);
    }
  }
}

export default MinioService;
