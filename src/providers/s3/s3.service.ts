import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';

@Injectable()
export default class S3Service {
  client!: S3Client;

  config;

  private logger = new Logger(S3Service.name);

  constructor(private configService: ConfigService) {
    /**
     * @desc Get S3 config from environment variables (@config/s3.config.ts)
     * @private
     * @type {object}
     * @example
     * this.config = {
     *  accessKeyId: process.env.S3_ACCESS_KEY_ID,
     *  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
     *  endpoint: process.env.S3_ENDPOINT,
     *  region: process.env.S3_REGION,
     *  bucket: {
     *      avatar: process.env.S3_AVATAR_BUCKET,
     *    },
     *  };
     */
    this.config = this.configService.get('s3');

    if (!this.config.accessKeyId) {
      this.logger.warn(`S3 access key ID not found in config ${this.config}`);
      throw new Error('S3 accessKeyId is not defined');
    }

    this.client = new S3Client({
      endpoint: this.config.endpoint,
      credentials: {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      },
      region: this.config.region,
      forcePathStyle: true,
    });
  }

  getRandomString(length: number): string {
    return Math.random().toString(36).substring(2, length);
  }

  getFileFormat(fileName: string): string {
    const fileNameArray: string[] = fileName.split('.');

    return fileNameArray[fileNameArray.length - 1];
  }

  createNewFileName(oldFileName?: string) {
    const fileFormat: string = oldFileName
      ? this.getFileFormat(oldFileName)
      : '';
    const randomSymbols: string = this.getRandomString(15);

    return `${Date.now()}-${randomSymbols}${
      fileFormat ? '.' : ''
    }${fileFormat}`;
  }

  /**
   * @desc Upload file to S3 bucket
   * @param file - file to upload
   * @param bucket - bucket name
   * @returns {Promise<PutObjectCommandOutput>} - AWS S3 response
   * @example
   *  const file = {
   *    originalname: 'image.png',
   *    buffer: Buffer,
   *    mimetype: 'image/png',
   *  };
   *  await this.s3Service.upload(file, 'bucket_name');
   */
  async upload(file, bucket): Promise<PutObjectCommandOutput> {
    const fileName = this.createNewFileName(file.originalname);

    const params = {
      Bucket: bucket,
      Key: fileName,
      Body: file.buffe,
      ContentType: file.mimetype,
    };

    return this.client.send(new PutObjectCommand(params));
  }
}
