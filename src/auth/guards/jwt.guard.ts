import { ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      if (!token) {
        throw new HttpException('Token is required', 401);
      }
      return super.canActivate(context);
    } catch (error) {
      throw new HttpException(error.message, error.status || 401);
    }
  }
}
