
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  private rolecheck: string;
  constructor(role: string) {
    this.rolecheck = role
  }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const ctx = context.switchToHttp();
    const request: any = ctx.getRequest<Request>();
    console.log(request.user);
    return this.rolecheck == request.user.role;
  }
}
