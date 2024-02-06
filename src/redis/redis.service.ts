import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async delete(key: string) {
    await this.client.del(key);
  }
}
