import { EncodingFormat } from '@app/open-ai/types/openAi.types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletion, CreateEmbeddingResponse } from 'openai/resources';

@Injectable()
export class OpenAiService {
  private readonly apiKey: string;
  private readonly model: string;
  private readonly openAI: OpenAI;
  private readonly dimensions: number;
  private readonly maxTokens: number;
  private readonly temperature: number;
  private readonly encodingFormat: EncodingFormat;
  private readonly embeddingModel: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPEN_AI_API_KEY');
    this.model = this.configService.get<string>('OPEN_AI_MODEL');
    this.embeddingModel = this.configService.get<string>(
      'OPEN_AI_EMBEDDING_MODEL',
    );
    this.encodingFormat = this.configService.get<EncodingFormat>(
      'OPEN_AI_ENCODING_FORMAT',
    );
    this.dimensions = Number(
      this.configService.get<number>('OPEN_AI_EMBEDDING_DIMENSIONS'),
    );
    this.maxTokens = Number(
      this.configService.get<number>('OPEN_AI_MAX_TOKEN'),
    );
    this.temperature = Number(
      this.configService.get<number>('OPEN_AI_TEMPERATURE'),
    );
    this.openAI = new OpenAI({ apiKey: this.apiKey });
  }

  public async generateText(
    prompt: string,
    userContent: any,
    json_format?: boolean,
  ): Promise<ChatCompletion> {
    try {
      return await this.openAI.chat.completions.create({
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: userContent },
        ],
        model: this.model,
        temperature: this.temperature,
        max_tokens: this.maxTokens,
        response_format: json_format ? { type: 'json_object' } : null,
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'OpenAi: Failed to generate chat completion',
      );
    }
  }

  public async generateEmbedding(
    data: string | string[],
  ): Promise<CreateEmbeddingResponse> {
    try {
      return await this.openAI.embeddings.create({
        model: this.embeddingModel,
        input: data,
        dimensions: this.dimensions,
        encoding_format: this.encodingFormat,
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(
        'OpenAi: Failed to generate embedding',
      );
    }
  }
}
