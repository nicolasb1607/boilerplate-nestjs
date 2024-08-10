import { ROLES_KEY } from '@app/auth/decorators/role.decorator';
import { Role } from '@app/auth/enums/role.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      throw new UnauthorizedException();
    }
    return this._hasRole(user.role, requiredRole);
  }

  private _hasRole(userRole: Role, requiredRole: Role): boolean {
    const roleHierarchy = {
      [Role.User]: 1,
      [Role.Candidate]: 2,
      [Role.Elected]: 3,
      [Role.Admin]: 4,
    };

    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
