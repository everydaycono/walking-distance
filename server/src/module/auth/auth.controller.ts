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
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';

import { RefreshGuard } from './guard/refresh-jwt.guard';
import { Request as ExpRequest } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './guard/access-jwt.guard';
import { Roles } from './decorators/roles.decorators';
import { Role } from './role.enum';
import { RolesGuard } from './guard/roles.guard';
import { AuthDTO } from './dto/auth.dto';

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
  @ApiOperation({ summary: 'Create User', description: 'Create New User' })
  @ApiBody({
    type: AuthDTO.Request.CreateUserDto
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
  @ApiBody({
    type: AuthDTO.Request.LoginUserDto
  })
  login(@Body() user: Pick<User, 'email' | 'password'>) {
    return this.authService.login(user);
  }

  /**
   * Social Login
   */
  @Post('social-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Social Login User' })
  // @ApiBody({
  //   type: AuthDTO.Request.LoginUserDto
  // })
  socialLogin(@Body() user: Pick<User, 'email' | 'id' | 'avatar' | 'type'>) {
    return this.authService.socialLogin(user);
  }

  /**
   * Refresh
   */
  @UseGuards(RefreshGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  refreshToken(@Request() req: RequestWithUser) {
    return this.authService.refreshToken(req.userInfo);
  }

  /**
   * verify email
   */
  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiExcludeEndpoint()
  verifyEmail(@Query('token') verifyToken: string) {
    if (!verifyToken) {
      throw new HttpException(
        'Verify token is required',
        HttpStatus.BAD_REQUEST
      );
    }
    return this.authService.verifyEmail(verifyToken);
  }

  // social redirect
  @ApiExcludeEndpoint()
  @Get('social-redirect')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('github'))
  async socialRedirect() {
    return 'redirecting to github...';
  }

  // github callback
  @ApiExcludeEndpoint()
  @Get('github-callback/')
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
      avatar: user.photos[0].value
    };
    return newUser;
  }

  // admin
  @ApiExcludeEndpoint()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin')
  @HttpCode(HttpStatus.OK)
  checkAdmin() {
    return this.authService.checkAdmin();
  }
}
