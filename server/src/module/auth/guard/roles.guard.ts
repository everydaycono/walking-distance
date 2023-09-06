import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorators';
import { Role } from '../role.enum';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/module/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    let token = request.headers.authorization;

    if (/Bearer/.test(token)) {
      token = token.split(' ').pop();
    }

    const user = this.jwtService.decode(token) as Pick<User, 'role'>;

    if (!user) {
      return false;
    }

    const hasRole = roles.some((role) => role === user.role);
    return user && user.role && hasRole;
  }
}
