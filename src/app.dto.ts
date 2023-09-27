import { ApiProperty } from "@nestjs/swagger"


export class SignInDto {
    @ApiProperty({type: 'string'})
    email: string
    @ApiProperty({type: 'string'})
    pass: string
}

export class UserDto {
    @ApiProperty({type: 'string'})
    email: string
    @ApiProperty({type: 'string'})
    pass: string
    @ApiProperty({type: 'string', required: false})
    fullName: string
    @ApiProperty({type: 'string', required: false})
    age: string
    @ApiProperty({ type: 'string', format: 'binary', required: false})
    avatar?: any 
}

export class EditUserDto {
    @ApiProperty({type: 'string'})
    pass: string
    @ApiProperty({type: 'string', required: false})
    fullName: string
    @ApiProperty({type: 'string', required: false})
    age: string
    @ApiProperty({ type: 'string', format: 'binary', required: false})
    avatar?: any 
}

export class BinhLuanDto{
    @ApiProperty({type: 'string'})
    content: string
    @ApiProperty({type: 'number'})
    iId: number
    // @ApiProperty({type: 'number'})
    // uId: number
}

export class SuaBinhLuanDto{
    @ApiProperty({type: 'string'})
    content: string
    // @ApiProperty({type: 'number'})
    // iId: number
    // @ApiProperty({type: 'number'})
    // uId: number
}

export class UpHinhDto {
    // @ApiProperty({ type: 'number'}) 
    // uId: number
    @ApiProperty({ type: 'string'}) 
    tenHinh: string
    @ApiProperty({ type: 'string', required: false}) 
    moTa: string
    @ApiProperty({ type: 'string', format: 'binary'}) 
    hinhAnh: any    // Phải đúng với key khai báo tham số 1 bên FileInterceptor
}  

export class EditHinhDto {
    @ApiProperty({ type: 'string'}) 
    tenHinh: string
    @ApiProperty({ type: 'string', required: false}) 
    moTa: string
}  


export class SaveDto {
    @ApiProperty({type: 'number'})
    iId: number
    // @ApiProperty({type: 'number'})
    // uId: number
}


