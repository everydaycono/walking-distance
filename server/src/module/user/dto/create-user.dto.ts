import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @MinLength(3, {
    message: 'firstName must be at least 3 characters'
  })
  firstName: string;

  @ApiProperty()
  @MinLength(3, {
    message: 'lastName must be at least 3 characters'
  })
  lastName: string;

  @ApiProperty()
  @IsEmail()
  @MinLength(5, {
    message: 'email must be at least 5 characters'
  })
  email: string;

  @ApiProperty()
  @MinLength(8, {
    message: 'password must be at least 8 characters'
  })
  password: string;
}
