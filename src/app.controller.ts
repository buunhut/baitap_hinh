import { ApiConsumes } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AppService,
  CommentsService,
  HinhAnhService,
  NguoiDungService,
} from './app.service';
import { ApiTags } from '@nestjs/swagger';
import {
  BinhLuanDto,
  EditHinhDto,
  EditUserDto,
  SaveDto,
  SignInDto,
  SuaBinhLuanDto,
  UpHinhDto,
  UserDto,
} from './app.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthBasic, AuthGuard } from './app.guard';

@ApiTags('dang-nhap')
@UseGuards(AuthBasic)
@Controller()
export class DangNhapController {
  constructor(private readonly appService: AppService) {}
  //đăng ký tài khoản
  @ApiConsumes('multipart/form-data')
  @Post('api/dang-ky')
  @UseInterceptors(
    FileInterceptor(
      'avatar', // Tham số 1: key FE gửi lên
      {
        // Tham số 2: định nghĩa nơi lưu, và lưu tên mới cho file
        storage: diskStorage({
          destination: process.cwd() + '/public/img',
          filename: (req, file, callback) =>
            callback(null, new Date().getTime() + '_' + file.originalname), // null: tham số báo lỗi
        }),
      },
    ),
  )
  signup(
    @Headers('token') token: string,
    @Body() data: UserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.signup(data, file);
  }

  //đăng nhập
  @Post('api/dang-nhap')
  signin(@Headers('token') token: string, @Body() data: SignInDto) {
    return this.appService.signin(data);
  }
}

@ApiTags('nguoi-dung')
@UseGuards(AuthGuard)
@Controller()
export class NguoiDungController {
  constructor(private readonly appService: NguoiDungService) {}

  //get thông tin user
  @Get('api/thong-tin-user/:uId')
  getThongTinUser(@Headers('token') token: string, @Param('uId') uId: number) {
    return this.appService.getThongTinUser(+uId);
  }

  //cập nhật thông tin user
  @ApiConsumes('multipart/form-data')
  @Put('api/cap-nhat-thong-tin-user/:uId')
  @UseInterceptors(
    FileInterceptor(
      'avatar', // Tham số 1: key FE gửi lên
      {
        // Tham số 2: định nghĩa nơi lưu, và lưu tên mới cho file
        storage: diskStorage({
          destination: process.cwd() + '/public/img',
          filename: (req, file, callback) =>
            callback(null, new Date().getTime() + '_' + file.originalname), // null: tham số báo lỗi
        }),
      },
    ),
  )
  editUser(
    @Headers('token') token: string,
    @Param('uId') uId: number,
    @Body() data: EditUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.appService.editUser(+uId, data, file);
  }
}

@ApiTags('hinh-anh')
@UseGuards(AuthGuard)
@Controller()
export class UploadController {
  constructor(private readonly appService: HinhAnhService) {}
  @ApiConsumes('multipart/form-data')
  @Post('api/up-hinh')
  @UseInterceptors(
    FileInterceptor(
      'hinhAnh', // Tham số 1: key FE gửi lên
      {
        // Tham số 2: định nghĩa nơi lưu, và lưu tên mới cho file
        storage: diskStorage({
          destination: process.cwd() + '/public/img',
          filename: (req, file, callback) =>
            callback(null, new Date().getTime() + '_' + file.originalname), // null: tham số báo lỗi
        }),
      },
    ),
  )
  upHinh(
    @Headers('token') token: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpHinhDto,
  ) {
    return this.appService.upHinh(data, file, token);
  }

  @Get('api/danh-sach-hinh')
  getHinhAnh(@Headers('token') token: string) {
    return this.appService.getAllHinhAnh();
  }

  @Get('api/danh-sach-hinh-by-user/:uId')
  getHinhAnhByUser(@Headers('token') token: string, @Param('uId') uId: number) {
    return this.appService.getHinhAnhByUser(+uId);
  }

  @Get('api/chi-tiet-hinh/:iId')
  getChiTiet(@Headers('token') token: string, @Param('iId') iId: number) {
    return this.appService.chiTietHinhAnh(+iId);
  }

  @Post('api/save-anh')
  saveHinhAnh(@Headers('token') token: string, @Body() data: SaveDto) {
    return this.appService.saveHinhAnh(data, token);
  }

  @Get('api/hinh-saved-by-user/:uId')
  getHinhAnhSavedByUser(
    @Headers('token') token: string,
    @Param('uId') uId: number,
  ) {
    return this.appService.getHinhAnhSavedByUser(+uId);
  }

  @Get('api/tim-kiem-anh/:keyword')
  searchHinhAnh(
    @Headers('token') token: string,
    @Param('keyword') keyword: string,
  ) {
    return this.appService.searchHinhAnh(keyword);
  }

  @Put('api/edit-hinh/:iId')
  editHinhAnh(
    @Headers('token') token: string,
    @Param('iId') iId: number,
    @Body() data: EditHinhDto,
  ) {
    return this.appService.editHinhAnh(+iId, data, token);
  }

  @Delete('api/xoa-hinh/:iId')
  delHinhAnh(@Headers('token') token: string, @Param('iId') iId: number) {
    return this.appService.delHinhAnh(+iId, token);
  }
}

@ApiTags('binh-luan')
@UseGuards(AuthGuard)
@Controller()
export class CommentsController {
  constructor(private readonly appService: CommentsService) {}
  @Post('api/binh-luan')
  postBinhLuan(@Headers('token') token: string, @Body() data: BinhLuanDto) {
    return this.appService.postBinhLuan(data, token);
  }

  @Get('api/binh-luan/:iId')
  getComment(@Headers('token') token: string, @Param('iId') iId: number) {
    return this.appService.getBinhLuan(+iId);
  }

  @Put('api/sua-binh-luan/:cId')
  putBinhLuan(
    @Headers('token') token: string,
    @Param('cId') cId: number,
    @Body() data: SuaBinhLuanDto,
  ) {
    return this.appService.putBinhLuan(+cId, data, token);
  }

  @Delete('api/del-binh-luan/:cId')
  delBinhLuan(@Headers('token') token: string, @Param('cId') cId: number) {
    return this.appService.delBinhLuan(+cId, token);
  }
}
