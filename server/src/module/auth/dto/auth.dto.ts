export class CreateAuthDto {}
import { ApiProperty } from '@nestjs/swagger';

export namespace AuthDTO {
  export namespace Request {
    export class createUserDto {
      @ApiProperty({
        example: 'test@gmail.com',
        description: 'email',
        required: true
      })
      email: string;

      @ApiProperty({
        example: 'password',
        description: 'password',
        required: true
      })
      password: string;

      @ApiProperty({
        example: 'firstName',
        description: 'firstName',
        required: true
      })
      firstName: string;

      @ApiProperty({
        example: 'lastName',
        description: 'lastName',
        required: true
      })
      lastName: string;
    }

    export class LoginUserDto {
      @ApiProperty({
        example: 'test@gmail.com',
        description: 'email',
        required: true
      })
      email: string;

      @ApiProperty({
        example: 'password',
        description: 'password',
        required: true
      })
      password: string;
    }
  }
}
