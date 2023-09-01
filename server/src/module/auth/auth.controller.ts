import {
  Controller,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Get,
  Query,
  HttpException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshGuard } from './guard/refresh-jwt.guard';
import { Request as ExpRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';

export interface IuserInfo {
  token: string;
  id: string;
}
interface RequestWithUser extends ExpRequest {
  userInfo: IuserInfo;
}

@ApiTags('🔐 Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register
   */
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'The found record',
    type: User,
  })
  @UseInterceptors(ClassSerializerInterceptor) // password 제거.
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  /**
   *
   * @param user
   * @returns
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginUserDto) {
    return this.authService.login(user);
  }

  /**
   * Refresh
   */
  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  refreshToken(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.userInfo);
  }

  @Get('verify-email')
  verifyEmail(@Query('token') verifyToken: string) {
    if (!verifyToken) {
      throw new HttpException(
        'Verify token is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.verifyEmail(verifyToken);
  }

  @Get('social-login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  async socialLogin() {
    return 'redirecting to github...';
  }

  @Get('github-callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req) {
    const { user } = req as {
      user: {
        id: string;
        username: string;
        photos: {
          value: string;
        }[];
        _json: {
          id: number;
        };
      };
    };

    const newUser = {
      id: user.id || user._json.id.toString(),
      userName: user.username,
      avatar: user.photos[0].value,
    };
    return this.authService.socialLogin(newUser, 'github');
  }
}
