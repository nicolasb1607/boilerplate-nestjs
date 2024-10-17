import { EncodingFormat } from '@app/open-ai/types/openAi.types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiException } from 'libs/shared/exceptions/api.exception';
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
  private readonly logger = new Logger(OpenAiService.name);

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
      this.logger.error('generateText = ' + e);
      throw new ApiException('Failed to generate chat completion', e);
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
      this.logger.error('generateEmbedding = ' + e);
      throw new ApiException('Failed to generate embedding', e);
    }
  }

  //Assistant Beta

  public async createAssistant(
    assistantName: string,
    instructions: string,
    tools: any[],
  ) {
    try {
      const assistant = await this.openAI.beta.assistants.create({
        name: assistantName,
        instructions: instructions,
        tools: tools,
        model: this.model,
      });
      return assistant;
    } catch (e) {
      throw new ApiException('Failed to create Assistant', e);
    }
  }

  public async createThread() {
    try {
      const thread = await this.openAI.beta.threads.create();
      return thread;
    } catch (e) {
      this.logger.error('createThread = ' + e);
      throw new ApiException('Failed to create thread', e);
    }
  }

  public async addMessageToThread(threadId: string, userContent: string) {
    try {
      const message = await this.openAI.beta.threads.messages.create(threadId, {
        role: 'user',
        content: userContent,
      });
      this.logger.log('Message added: ' + JSON.stringify(message));
      return message;
    } catch (e) {
      this.logger.error('addMessageToThread = ' + e);
      throw new ApiException('Failed to add message to thread', e);
    }
  }

  public async runAssistantOnThread(threadId: string, assistantId: string) {
    try {
      const run = await this.openAI.beta.threads.runs.create(threadId, {
        assistant_id: assistantId,
      });
      return run;
    } catch (e) {
      this.logger.error('runAssistantOnThread = ' + e);
      throw new ApiException('Failed to run assistant on thread', e);
    }
  }

  public async pollRunCompletion(
    threadId: string,
    runId: string,
  ): Promise<any> {
    const pollInterval = 1000;
    const maxRetries = 60;

    for (let retry = 0; retry < maxRetries; retry++) {
      const run = await this.openAI.beta.threads.runs.retrieve(threadId, runId);
      if (run.status === 'completed') {
        return await this.openAI.beta.threads.messages.list(threadId);
      }
      if (run.status === 'failed') {
        throw new ApiException(
          `Assistant run failed with error`,
          run.last_error,
        );
      }
      await this.sleep(pollInterval);
    }

    throw new Error('Assistant run timed out.');
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
