import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsEmail()
  @MinLength(5, {
    message: 'email must be at least 5 characters',
  })
  email: string;

  @ApiProperty()
  @MinLength(8, {
    message: 'password must be at least 8 characters',
  })
  password: string;
}

