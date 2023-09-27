import {
  BinhLuanDto,
  UserDto,
  SignInDto,
  UpHinhDto,
  SaveDto,
  EditUserDto,
  SuaBinhLuanDto,
  EditHinhDto,
} from './app.dto';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { MyService } from './app.jwt';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

//respone
const response = (statusCode: number, message: string, content: any) => {
  return {
    statusCode,
    message,
    content,
  };
};

@Injectable()
export class AppService {
  constructor(private readonly jwtService: JwtService) {}

  //đăng nhập
  async signin(data: SignInDto) {
    try {
      let { email, pass } = data;
      const checkAcc = await prisma.users.findFirst({
        where: {
          email,
          sta: true,
        },
      });
      if (checkAcc) {
        const user = await prisma.users.findFirst({
          where: {
            email,
            sta: true,
          },
        });
        const result = await bcrypt.compare(pass, user.pass);
        if (result) {
          const { uId, email, fullName, age, avatar } = user;
          const token = this.jwtService.sign(user);
          const data = {
            uId,
            email,
            fullName,
            age,
            avatar,
            token,
          };
          return response(200, 'đăng nhập thành công', data);
        } else {
          return response(404, 'sai mật khẩu', data);
        }
      } else {
        return response(404, 'sai tài khoản', data);
      }
    } catch (error) {
      throw error;
    }
  }

  //đăng ký
  async signup(data: UserDto, file: Express.Multer.File) {
    let { email, pass, fullName, age } = data;
    let hashedPassword = await bcrypt.hash(pass, 10)
    let avatar = '';
    if (file) {
      avatar = file.filename;
    }
    try {
      const checkAcc = await prisma.users.findFirst({
        where: {
          email,
          sta: true,
        },
      });
      if (checkAcc) {
        //trùng tài khoản
        //xoá bỏ file mới up lên
        return response(409, 'tài khoản đã tồn tại', email);
      } else {
        const data = {
          email,
          pass: hashedPassword,
          fullName,
          age,
          avatar,
        };
        const result = await prisma.users.create({
          data,
        });
        if (result) {
          return response(200, 'đăng ký thành công', data);
        } else {
          return response(500, 'lỗi rồi ku', null);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class NguoiDungService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly myService: MyService,
  ) {}

  //get thông tin user
  async getThongTinUser(uId: number) {
    try {
      const user = await prisma.users.findFirst({
        where: {
          uId,
          sta: true,
        },
      });
      if (user) {
        const data = {
          ...user,
          pass: 'secret key :)',
        };
        return response(200, 'thông tin user', data);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //cập nhật thông tin user
  async editUser(uId: number, edit: EditUserDto, file: Express.Multer.File) {
    let { pass, fullName, age } = edit;
    let hashedPassword = await bcrypt.hash(pass, 10)
    let data = {};
    if (file) {
      const avatar = file.filename;
      data = {
        pass: hashedPassword,
        fullName,
        age,
        avatar,
      };
    } else {
      data = {
        pass: hashedPassword,
        fullName,
        age,
      };
    }
    const updateUser = await prisma.users.updateMany({
      data,
      where: {
        uId,
        sta: true,
      },
    });
    if (updateUser) {
      return response(200, 'đã cập nhật thông tin user', data);
    } else {
      return response(500, 'lỗi rồi ku', null);
    }
  }
}

@Injectable()
export class HinhAnhService {
  constructor(private readonly myService: MyService) {}
  async upHinh(upHinh: UpHinhDto, file: Express.Multer.File, token: string) {
    // return 'tên hình ' + url;
    try {
      const uId = await this.myService.getUserId(token);
      const url = file.filename;
      const { tenHinh, moTa } = upHinh;
      // const uId = Number(upHinh.uId);
      const dateUp = new Date();
      const data = {
        tenHinh,
        moTa,
        url,
        dateUp,
        uId,
      };
      const result = await prisma.images.create({
        data,
      });
      if (result) {
        return response(200, 'đã up hình', result);
      } else {
        return response(500, 'lỗi rồi ku', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //lấy danh sách tất cả hình ảnh
  async getAllHinhAnh() {
    try {
      const listhinhAnh = await prisma.images.findMany({
        where: {
          sta: true,
        },
        select: {
          iId: true,
          tenHinh: true,
          url: true,
          moTa: true,
          dateUp: true,
          users: {
            select: {
              uId: true,
              email: true,
              fullName: true,
              age: true,
            },
          },
          comments: {
            select: {
              content: true,
              dateComment: true,
              users: {
                select: {
                  uId: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });
      if (listhinhAnh.length > 0) {
        return response(200, 'danh sách hình ảnh', listhinhAnh);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //lấy danh sách hình ảnh của user
  async getHinhAnhByUser(uId: number) {
    try {
      const hinhAnh = await prisma.images.findMany({
        where: {
          uId,
          sta: true,
        },
        select: {
          iId: true,
          tenHinh: true,
          url: true,
          moTa: true,
          dateUp: true,
          // users: {
          //   select: {
          //     uId: true,
          //     email: true,
          //     fullName: true,
          //     age: true,
          //   },
          // },
          comments: {
            select: {
              content: true,
              dateComment: true,
              users: {
                select: {
                  uId: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });
      if (hinhAnh.length > 0) {
        return response(200, 'danh sách hình', hinhAnh);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //lấy chi tiết hình ảnh + thông tin user
  async chiTietHinhAnh(iId: number) {
    try {
      const detail = await prisma.images.findFirst({
        where: {
          iId,
          sta: true,
          users: {
            sta: true,
          },
        },
        select: {
          iId: true,
          dateUp: true,
          tenHinh: true,
          url: true,
          users: {
            select: {
              uId: true,
              fullName: true,
            },
          },
          comments: {
            select: {
              cId: true,
              content: true,
              dateComment: true,
              users: {
                select: {
                  uId: true,
                  fullName: true,
                },
              },
            },
            where: {
              sta: true,
            },
          },
        },
      });
      if (detail) {
        return response(200, 'thông tin chi tiết', detail);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //lưu ảnh
  async saveHinhAnh(save: SaveDto, token: string) {
    try {
      const uId = await this.myService.getUserId(token);
      const dateSave = new Date();
      const data = {
        ...save,
        dateSave,
        uId,
      };
      const savedAnh = await prisma.saved.create({
        data,
      });
      if (savedAnh) {
        return response(200, 'đã lưu ảnh', savedAnh);
      } else {
        return response(500, 'lỗi rồi ku', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //get danh sách ảnh lưu by user
  async getHinhAnhSavedByUser(uId: number) {
    try {
      const listSaved = await prisma.saved.findMany({
        where: {
          uId,
          sta: true,
        },
        select: {
          sId: true,
          dateSave: true,
          uId: true,
          images: {
            select: {
              tenHinh: true,
            },
          },
        },
        // include: {
        //   images: {
        //     select: {
        //       tenHinh: true,
        //     },
        //   },
        // },
      });
      if (listSaved.length > 0) {
        return response(200, 'danh sách ảnh đã lưu', listSaved);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //tìm kiếm hình ảnh theo tên hình
  async searchHinhAnh(keyword: string) {
    try {
      const result = await prisma.images.findMany({
        where: {
          tenHinh: { contains: keyword },
          sta: true,
        },
      });
      if (result.length > 0) {
        return response(200, 'kết quả tìm kiếm', result);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //sửa tên hình + miêu tả
  async editHinhAnh(iId: number, edit: EditHinhDto, token: string) {
    try {
      let uId = await this.myService.getUserId(token);
      const check = await prisma.images.findFirst({
        where: {
          iId, 
          uId, 
          sta: true
        }
      })
      if(check){
        const update = await prisma.images.updateMany({
          data: edit,
          where: {
            iId,
            uId,
            sta: true
          }
        })
        if(update){
          const data = {
            ...check,
            ...edit,
          }
          return response(200, 'đã cập nhật', data)
        } else {
          return response(500, 'lỗi rồi ku', null)
        }
      } else {
        return response(404, 'not found', null)
      }

    } catch (error) {
      throw error
    }
  }

  //xoá hình ảnh theo iId
  async delHinhAnh(iId: number, token: string) {
    try {
      const uId = await this.myService.getUserId(token);
      const checkiId = await prisma.images.findFirst({
        where: {
          iId,
          uId,
          sta: true,
        },
      });
      if (checkiId) {
        const xoaHinh = await prisma.images.updateMany({
          data: {
            sta: false,
          },
          where: {
            iId,
          },
        });
        if (xoaHinh) {
          return response(200, 'đã xoá', checkiId);
        } else {
          return response(500, 'lỗi rồi ku', null);
        }
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }
}

@Injectable()
export class CommentsService {
  constructor(private readonly myService: MyService) {}
  //post bình bình luận cho ảnh
  async postBinhLuan(binhLuan: BinhLuanDto, token: string) {
    try {
      const uId = await this.myService.getUserId(token);
      const dateComment = new Date();
      const data = {
        ...binhLuan,
        dateComment,
        uId,
      };
      const postBl = await prisma.comments.create({
        data,
      });
      if (postBl) {
        return response(200, 'đã lưu comment', postBl);
      } else {
        return response(500, 'lỗi rồi ku', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //get bình luận theo id ảnh
  async getBinhLuan(iId: number) {
    try {
      const comment = await prisma.comments.findMany({
        where: {
          iId,
          sta: true,
        },
      });
      if (comment.length > 0) {
        return response(200, 'list comment', comment);
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //sửa bình luận
  async putBinhLuan(cId: number, edit: SuaBinhLuanDto, token: string) {
    try {
      const uId = await this.myService.getUserId(token);
      const dateComment = new Date();
      const data = {
        ...edit,
        dateComment,
        uId,
      };
      const checkCId = await prisma.comments.findFirst({
        where: {
          cId,
          uId,
          sta: true,
        },
      });
      if (checkCId) {
        const updateC = await prisma.comments.updateMany({
          data,
          where: {
            cId,
            uId,
            sta: true,
          },
        });
        if (updateC) {
          return response(200, 'đã cập nhật bình luận', data);
        } else {
          return response(500, 'lỗi rồi ku', null);
        }
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }

  //xoá bình luận
  async delBinhLuan(cId: number, token: string) {
    try {
      const uId = await this.myService.getUserId(token);
      const checkCId = await prisma.comments.findFirst({
        where: {
          cId,
          uId,
          sta: true,
        },
      });
      if (checkCId) {
        const xoaBinhLuan = await prisma.comments.updateMany({
          data: {
            sta: false,
          },
          where: {
            cId,
            uId,
            sta: true,
          },
        });
        if (xoaBinhLuan) {
          return response(200, 'đã xoá bình luận', checkCId);
        } else {
          return response(500, 'lỗi rồi ku', null);
        }
      } else {
        return response(404, 'not found', null);
      }
    } catch (error) {
      throw error;
    }
  }
}
