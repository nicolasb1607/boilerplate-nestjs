import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';
import { parseBoolean } from 'libs/shared/functions/shared.functions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RedisService {
  public readonly publisher: Redis;
  public readonly subscriber: Redis;
  private readonly devMode: boolean;

  constructor(private readonly configService: ConfigService) {
    this.devMode = parseBoolean(
      this.configService.get<boolean>('DEVELOPMENT_MODE', {
        infer: true,
      }),
    );
    const config: RedisOptions = {
      host: this.configService.get<string>('REDIS_HOST'),
      port: Number(this.configService.get<number>('REDIS_PORT')),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      tls:
        this.devMode === true
          ? undefined
          : {
              rejectUnauthorized: false,
            },
    };

    this.publisher = new Redis(config);
    this.subscriber = new Redis(config);
  }

  public async set(
    key: string,
    value: string,
    ttlSeconds: number,
  ): Promise<void> {
    await this.publisher.setex(key, ttlSeconds, value);
  }

  public async get(key: string): Promise<string | null> {
    return await this.publisher.get(key);
  }

  public async publish(channel: string, message: string) {
    await this.publisher.publish(channel, message);
  }

  public async subscribe(channel: string, callback: (message: string) => void) {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, message) => {
      if ((ch = channel)) {
        callback(message);
      }
    });
  }

  public async unsubscribe(channel: string) {
    await this.subscriber.unsubscribe(channel);
  }

  // Redis Lock functionality
  public async acquireLock(
    key: string,
    ttlMillis: number,
  ): Promise<string | null> {
    const lockId = uuidv4();
    const result = await this.publisher.set(
      `lock:${key}`,
      lockId,
      'PX',
      ttlMillis,
      'NX',
    );

    return result === 'OK' ? lockId : null;
  }

  public async releaseLock(key: string, lockId: string): Promise<boolean> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    const result = await this.publisher.eval(script, 1, `lock:${key}`, lockId);

    return result === 1;
  }

  public async extendLock(
    key: string,
    lockId: string,
    ttlMillis: number,
  ): Promise<boolean> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("pexpire", KEYS[1], ARGV[2])
      else
        return 0
      end
    `;

    const result = await this.publisher.eval(
      script,
      1,
      `lock:${key}`,
      lockId,
      ttlMillis.toString(),
    );

    return result === 1;
  }
}
