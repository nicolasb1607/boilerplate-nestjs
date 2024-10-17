import { Orientation } from '@app/pexels/types/orientation.type';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from 'libs/shared/exceptions/api.exception';
import { createClient, Photos } from 'pexels';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PexelsService {
  private readonly logger = new Logger(PexelsService.name);
  private readonly apiKey: string;
  private readonly client;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('PEXELS_API_KEY');
    this.client = createClient(this.apiKey);
  }

  public async searchPhotos(
    query: string,
    page?: number,
    limit?: number,
    orientation?: Orientation,
  ): Promise<Photos> {
    try {
      const photos = await this.client.photos.search({
        query,
        page,
        per_page: limit,
        orientation,
      });
      return photos;
    } catch (e) {
      this.logger.error('searchPhotos = ' + e);
      throw new ApiException('Failed to get pexels photos', e);
    }
  }

  public async searchPhotoCurated(
    query: string,
    page?: number,
    limit?: number,
  ): Promise<Photos> {
    try {
      const photos = await this.client.photos.search({
        query,
        page,
        per_page: limit,
      });
      return photos;
    } catch (e) {
      this.logger.error('searchPhotos = ' + e);
      throw new ApiException('Failed to get pexels photos', e);
    }
  }

  public async getPhotoDataByUrl(url: string) {
    try {
      const response = await this.httpService.get(url, {
        responseType: 'arraybuffer',
      });
      const lstValFrom = await lastValueFrom(response);
      return lstValFrom.data;
    } catch (e) {
      this.logger.error('getPhotoDataByUrl = ' + e);
      throw new ApiException('Failed to get photo data', e);
    }
  }
}
