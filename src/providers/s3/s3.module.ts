import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import S3Service from './s3.service';

/**
 * @desc S3 module for uploading files to S3 bucket (min.io)
 * @tutorial before use check configuration in `src/config/s3.config.ts`
 * and initialize the module in `src/app.module.ts`
 * @module S3Module
 * @public
 * @example
 *  await this.s3Service.upload(file, 'bucket_name');
 */
@Module({
  imports: [ConfigModule],
  providers: [S3Service],
  exports: [S3Service],
})
export default class S3Module {}
