import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sharp from 'sharp';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get<string>('BUCKET_NAME');
    this.region = this.configService.get<string>('AWS_S3_REGION');
    this.s3Client = new S3Client({ region: this.region });
  }

  public async uploadImage(file: Express.Multer.File) {
    try {
      const compressedImage = await sharp(file.buffer)
        .resize(800)
        .jpeg({ quality: 80 })
        .toBuffer();

      const fileName = `${Date.now()}-${file.originalname}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: compressedImage,
          ContentType: 'image/jpeg',
        }),
      );

      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  public async deleteImage(url: string): Promise<void> {
    try {
      const key = this._extractKeyFromUrl(url);

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  //****************************************************************************
  // PRIVATE METHODS
  //****************************************************************************

  private _extractKeyFromUrl(url: string): string {
    const urlParts = new URL(url);

    // Remove the bucket domain part to get the key
    const path = urlParts.pathname;
    const key = path.startsWith('/') ? path.substring(1) : path;

    return key;
  }
}
