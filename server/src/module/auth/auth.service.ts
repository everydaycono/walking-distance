import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { passwordCompare, passwordHash } from 'src/utils/user.utils';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import {
  accessTkExpiresIn,
  createRandomToken,
  emailVerificationExpiry,
  refreshTkExpiresIn,
  updateRandomToken,
} from 'src/utils/auth.utils';
import { IuserInfo } from './auth.controller';
import { MailService } from '../mail/mail.service';
import { RedirectException } from 'src/filter/redirect.exception';

interface socialLoginType {
  id: string;
  userName: string;
  avatar: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async register(user: Partial<User>) {
    const { firstName, lastName, email, password } = user;
    if (!password || !firstName || !lastName || !email) {
      throw new BadRequestException('Please enter all required fields');
    }

    // check if user exists with email
    const isUserExist = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (isUserExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    // Encrypt password
    user.password = passwordHash(password);

    const unHashedToken = createRandomToken;
    const hashedToken = updateRandomToken(unHashedToken);

    // Send verify cation email
    await this.mailService.sendUserConfirmation(user, unHashedToken);

    const newUserInfo = Object.assign(user, {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: new Date(Date.now() + emailVerificationExpiry),
    });
    const newUser = await this.userRepository.create(newUserInfo);
    await this.userRepository.save(newUser);

    delete newUser.emailVerificationExpiry;
    delete newUser.emailVerificationToken;
    delete newUser.isEmailVerified;

    return {
      message: 'email verification sent, please verify your email',
      email: newUser.email,
      description: `Verify your email We've sent an email to ${newUser.email} to verify  your email and activate your account.`,
    };
  }

  async login(user: LoginUserDto) {
    // Find exist user with email
    const isExistUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (!isExistUser) {
      throw new HttpException(
        'Incorrect user name or password',
        HttpStatus.NOT_FOUND
      );
    }

    // email verification check
    if (!isExistUser.isEmailVerified) {
      throw new HttpException(
        'Please verify your email',
        HttpStatus.BAD_REQUEST
      );
    }
    // Check password
    const isPasswordCorrect = passwordCompare({
      plainPassword: isExistUser.password,
      hashedPassword: user.password,
    });
    if (!isPasswordCorrect) {
      throw new HttpException(
        'Incorrect user name or password',
        HttpStatus.NOT_FOUND
      );
    }

    // User status check ("locekd",'active')
    if (isExistUser.status === 'locked') {
      throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
    }

    // Create JWT TOKEN
    const ACCESSTK = this.generateAccessToken(isExistUser);
    const REFRESHTK = this.generateRefereshToken(isExistUser);

    // Save refresh token in db
    this.userRepository.update(
      { id: isExistUser.id },
      { refreshToken: REFRESHTK }
    );

    const userInfo = {
      email: isExistUser.email,
      firstName: isExistUser.firstName,
      lastName: isExistUser.lastName,
      avatar: isExistUser.avatar,
      role: isExistUser.role,
      id: isExistUser.id,
    };

    return Object.assign(userInfo, {
      token: {
        access: ACCESSTK,
        refresh: REFRESHTK,
      },
    });
  }

  async refreshToken(userInfo: IuserInfo) {
    const user = await this.userRepository.findOne({
      where: { id: userInfo.id, refreshToken: userInfo.token },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (user.status === 'locked') {
      throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefereshToken(user);

    this.userRepository.update({ id: user.id }, { refreshToken: refreshToken });

    return {
      token: {
        access: accessToken,
        refresh: refreshToken,
      },
    };
  }

  async verifyEmail(verifyToken: string) {
    // find user by verifyToken and emailVerificationExpiry

    const hashToken = updateRandomToken(verifyToken);
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: hashToken,
        emailVerificationExpiry: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // If we found the user that means the token is valid
    // Now we can remove the associated email token and expiry date as we no  longer need them
    user.emailVerificationToken = null;
    user.emailVerificationExpiry = null;
    user.isEmailVerified = true;
    await this.userRepository.update(user.id, user);

    return {
      isEmailVerified: true,
      message: 'Email is verified',
    };
  }

  async socialLogin(user: socialLoginType, type: 'github' | 'google') {
    // user exist check
    const isExistUser = await this.userRepository.findOne({
      where: { email: user.userName, type },
    });

    // Client 는 회원가입 창으로 넘김.
    if (!isExistUser) {
      // throw new NotFoundException('User not found, redirect to register page');
      throw new RedirectException({
        userInfo: { ...user, type },
      });
    }

    // user 가 있다면 login

    // 체크리스트
    // [x] 이메일 verified (소셜로그인은 verified)
    // [x] password check (소셜로그인은 password 없음)
    // [✅] user status (locked,active 체크)
    if (isExistUser.status === 'locked') {
      throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
      // throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
    }

    // Create JWT TOKEN
    const ACCESSTK = this.generateAccessToken(isExistUser);
    const REFRESHTK = this.generateRefereshToken(isExistUser);

    // Save refresh token in db
    this.userRepository.update(
      { id: isExistUser.id },
      { refreshToken: REFRESHTK }
    );

    const userInfo = {
      email: isExistUser.email,
      firstName: isExistUser.firstName,
      lastName: isExistUser.lastName,
      avatar: isExistUser.avatar,
      role: isExistUser.role,
      id: isExistUser.id,
    };

    return Object.assign(userInfo, {
      token: {
        access: ACCESSTK,
        refresh: REFRESHTK,
      },
    });
  }

  generateAccessToken(
    user: Pick<
      User,
      'email' | 'firstName' | 'lastName' | 'avatar' | 'role' | 'status' | 'id'
    >
  ) {
    return this.jwtService.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        id: user.id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: accessTkExpiresIn,
      }
    );
  }

  generateRefereshToken(user: Pick<User, 'id'>) {
    return this.jwtService.sign(
      {
        id: user.id,
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshTkExpiresIn,
      }
    );
  }
}
