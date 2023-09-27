import { Module } from '@nestjs/common';
import {
  DangNhapController,
  UploadController,
  NguoiDungController,
  CommentsController,
} from './app.controller';
import {
  AppService,
  CommentsService,
  HinhAnhService,
  NguoiDungService,
} from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MyService } from './app.jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Thay thế bằng secret key thực tế của bạn
      signOptions: { expiresIn: '1d' }, // Thời hạn của token
    }),
  ],
  controllers: [
    DangNhapController,
    NguoiDungController,
    UploadController,
    CommentsController,
  ],
  providers: [
    AppService,
    NguoiDungService,
    HinhAnhService,
    MyService,
    CommentsService,
  ],
})
export class AppModule {}
