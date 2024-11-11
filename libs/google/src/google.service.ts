import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import GoogleImages from 'google-images';
import { ApiException } from 'libs/shared/exceptions/api.exception';

@Injectable()
export class GoogleService {
        private readonly apiKey: string;
        private readonly cseId: string;
        private readonly client: GoogleImages;
        private readonly logger = new Logger(GoogleService.name);

        constructor(private readonly configService: ConfigService) {
                this.apiKey = configService.get<string>('GOOGLE_API_KEY');
                this.cseId = configService.get<string>(
                        'GOOGLE_CUSTOM_SEARCH_ENGINE_ID',
                );
                this.client = new GoogleImages(this.cseId, this.apiKey);
        }

        public async searchImage(
                query: string,
                options?: GoogleImages.SearchOptions,
                slice = 8,
        ): Promise<GoogleImages.Image[]> {
                try {
                        const result = await this.client.search(query, options);
                        return result.slice(0, slice);
                } catch (e) {
                        this.logger.error('searchImage = ' + e);
                        throw new ApiException('Failed to search image', e);
                }
        }
}
