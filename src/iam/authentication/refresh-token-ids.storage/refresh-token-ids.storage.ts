import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../redis/redis.service';
import { InvalidatedRefreshTokenError } from './Error/InvalidateRefreshTokenError';

@Injectable()
export class RefreshTokenIdsStorage {
  constructor(private readonly redisService: RedisService) {}
  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisService.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisService.get(this.getKey(userId));
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisService.delete(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
