import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MyService {
  constructor(private readonly jwtService: JwtService) {}

  async getUserId(token: string) {
    const verify = await this.jwtService.verify(token);
    return verify.uId;
  }
}
