import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //cho phép truy cập api
  app.enableCors({ origin: "*" });


  //cấu hình swagger API
  const config = new DocumentBuilder()
    .setTitle('CYBERSOFT - NODEJS KHOÁ 33')
    .setDescription('Bài tập hình ảnh. api/dang-ky và api/dang-nhap truyền token mặc định là NODE33')
    .setVersion('v1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(8080);
}
bootstrap();


//khởi tạo dự án nestjs bằng lệnh nest new tên dự án
//test khởi chạy bằng yarn start:dev

//cài prisma
//yarn add prisma @prisma/client
//yarn prisma init, chạy xong vào .env sửa thông tin chuỗi kết nối, vào schema.prisma sửa provider = "mysql"

//yarm prisma db pull
//yarn prisma generate

//cài swagger
//yarn add @nestjs/swagger swagger-ui-express
//cấu hình swagger trong main.ts