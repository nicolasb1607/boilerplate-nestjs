import { UserRequest } from '@app/auth';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const userId = request.user?.id; // Get the user ID from the request
    const key = `${request.method}-${request.url}-${userId}`; // Create a custom cache key that includes the user ID

    if (!userId) {
      // If there's no user ID, don't cache this request
      return undefined;
    }

    return key; // Return the custom cache key
  }
}
