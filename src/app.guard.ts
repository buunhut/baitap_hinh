import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthBasic implements CanActivate {
  // constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest(); //bắt được request
      const { token } = request.headers;
      if (token !== 'NODE33') {
        throw new UnauthorizedException('token không hợp lệ');
      }
      return true; //return true để next()
    } catch (error) {
      throw new UnauthorizedException('token không hợp lệ');
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest(); //bắt được request
      const { token } = request.headers;
      const verify = this.jwtService.verify(token); //verify token
      if (!verify) {
        throw new UnauthorizedException('token không hợp lệ');
      }
      return true; //return true để next()
    } catch (error) {
      throw new UnauthorizedException('token không hợp lệ');
    }
  }
}
