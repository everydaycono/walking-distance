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
  Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RefreshGuard } from './guard/refresh-jwt.guard';
import { Request as ExpRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guard/access-jwt.guard';
import { Roles } from './decorators/roles.decorators';
import { Role } from './role.enum';
import { RolesGuard } from './guard/roles.guard';

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
    description: 'Created user'
  })
  @UseInterceptors(ClassSerializerInterceptor) // password 제거.
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() user: Partial<User>) {
    return this.authService.register(user);
  }

  /**
   * Login
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({
    status: 200,
    description: 'login user'
  })
  login(@Body() user: Pick<User, 'email' | 'password'>) {
    return this.authService.login(user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Check admin' })
  @ApiResponse({
    status: 200,
    description: 'Check admin'
  })
  checkAdmin() {
    return this.authService.checkAdmin();
  }

  /**
   * Refresh
   */
  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Get refresh token'
  })
  refreshToken(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.userInfo);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email' })
  @ApiResponse({
    status: 200,
    description: 'Verify email'
  })
  verifyEmail(@Query('token') verifyToken: string) {
    if (!verifyToken) {
      throw new HttpException(
        'Verify token is required',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.authService.verifyEmail(verifyToken);
  }

  @Get('social-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Github Login Redirect' })
  @ApiResponse({
    status: 200,
    description: 'Github Login'
  })
  @UseGuards(AuthGuard('github'))
  async socialLogin() {
    return 'redirecting to github...';
  }

  @Get('github-callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Github Login Callback' })
  @ApiResponse({
    status: 200,
    description: 'Github Login Callback'
  })
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
      avatar: user.photos[0].value
    };
    return this.authService.socialLogin(newUser, 'github');
  }
}
