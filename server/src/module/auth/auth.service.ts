import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { passwordCompare, passwordHash } from 'src/utils/user.utils';
import { JwtService } from '@nestjs/jwt';
import {
  accessTkDevExpiresIn,
  accessTkPrdExpiresIn,
  createRandomToken,
  emailVerificationExpiry,
  refreshTkExpiresIn,
  updateRandomToken
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
        email
      }
    });

    if (isUserExist) {
      throw new ConflictException('User already exists');
    }

    // Encrypt password
    user.password = passwordHash(password);

    const unHashedToken = createRandomToken;
    const hashedToken = updateRandomToken(unHashedToken);

    // Send verify cation email
    await this.mailService.sendUserConfirmation(user, unHashedToken);

    const newUserInfo = Object.assign(user, {
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: new Date(Date.now() + emailVerificationExpiry)
    });
    const newUser = await this.userRepository.create(newUserInfo);
    await this.userRepository.save(newUser);

    delete newUser.emailVerificationExpiry;
    delete newUser.emailVerificationToken;
    delete newUser.isEmailVerified;

    return {
      message: 'email verification sent, please verify your email',
      email: newUser.email,
      description: `Verify your email We've sent an email to ${newUser.email} to verify  your email and activate your account.`
    };
  }

  // login
  async login(user: Pick<User, 'email' | 'password'>) {
    if (!user.email || !user.password) {
      throw new BadRequestException('Please enter all required fields');
    }
    // Find exist user with email
    const isExistUser = await this.userRepository.findOne({
      where: { email: user.email }
    });

    if (!isExistUser) {
      throw new UnauthorizedException('Incorrect user name or password');
    }

    // email verification check
    if (!isExistUser.isEmailVerified) {
      throw new HttpException(
        'Please verify your email',
        HttpStatus.BAD_REQUEST
      );
    }
    // Check password
    const isPasswordCorrect = await passwordCompare({
      hashedPassword: isExistUser.password,
      plainPassword: user.password
    });

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Incorrect user name or password');
    }

    // User status check ("locekd",'active')
    if (isExistUser.status === 'locked') {
      throw new ForbiddenException('Your account is locked');
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
      id: isExistUser.id
    };

    // const devExpriesTime = 3 * 60 * 60 * 1000;
    const devExpriesTime = 5 * 1000;
    const prdExpriesTime = 15 * 60 * 1000;
    const EXPIRE_TIME =
      process.env.NODE_ENV === 'dev' ? devExpriesTime : prdExpriesTime;

    return Object.assign(userInfo, {
      token: {
        access: ACCESSTK,
        refresh: REFRESHTK,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
      }
    });
  }

  // social login
  async socialLogin(user: Pick<User, 'email' | 'id' | 'avatar' | 'type'>) {
    // format email with github username
    const formatEmail = `${user.email}@${user.type}`;

    // user exist check
    const isExistUser = await this.userRepository.findOne({
      where: { email: formatEmail }
    });

    // if not exist user in db throw not found error
    if (!isExistUser) {
      return this.socialRegister(user);
    }

    // if already exist user in db
    // Create JWT TOKEN
    const ACCESSTK = this.generateAccessToken(isExistUser);
    const REFRESHTK = this.generateRefereshToken(isExistUser);

    // Save refresh token in db
    this.userRepository.update(
      { email: isExistUser.email },
      { refreshToken: REFRESHTK }
    );

    // define userInfo
    const userInfo = {
      email: isExistUser.email,
      firstName: isExistUser.firstName,
      lastName: isExistUser.lastName,
      avatar: isExistUser.avatar,
      role: isExistUser.role,
      id: isExistUser.id
    };

    // const devExpriesTime = 3 * 60 * 60 * 1000;
    const devExpriesTime = 5 * 1000;
    const prdExpriesTime = 15 * 60 * 1000;
    const EXPIRE_TIME =
      process.env.NODE_ENV === 'dev' ? devExpriesTime : prdExpriesTime;

    return Object.assign(userInfo, {
      token: {
        access: ACCESSTK,
        refresh: REFRESHTK,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
      }
    });
  }

  /**
   * new user social register
   * @param user
   */
  async socialRegister(user: Pick<User, 'email' | 'id' | 'avatar' | 'type'>) {
    const { avatar, email, id, type } = user;
    const newSocialUser = this.userRepository.create({
      email: `${email}@${type}`,
      avatar,
      type,
      firstName: email,
      lastName: type,
      password: passwordHash(id),
      isEmailVerified: true
    });
    const newUser = await this.userRepository.save(newSocialUser);

    const ACCESSTK = this.generateAccessToken(newUser);
    const REFRESHTK = this.generateRefereshToken(newUser);

    this.userRepository.update(
      { email: newUser.email },
      { refreshToken: REFRESHTK }
    );

    const userInfo = {
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      role: newUser.role,
      id: newUser.id,
      type: newUser.type
    };

    const devExpriesTime = 5 * 1000;
    const prdExpriesTime = 15 * 60 * 1000;
    const EXPIRE_TIME =
      process.env.NODE_ENV === 'dev' ? devExpriesTime : prdExpriesTime;

    return Object.assign(userInfo, {
      token: {
        access: ACCESSTK,
        refresh: REFRESHTK,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
      }
    });
  }

  async refreshToken(userInfo: IuserInfo) {
    const user = await this.userRepository.findOne({
      where: { id: userInfo.id, refreshToken: userInfo.token }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (user.status === 'locked') {
      throw new HttpException('Your account is locked', HttpStatus.FORBIDDEN);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefereshToken(user);

    // this.userRepository.update({ id: user.id }, { refreshToken: refreshToken });

    // const devExpriesTime = 3 * 60 * 60 * 1000;
    const devExpriesTime = 5 * 1000;
    const prdExpriesTime = 15 * 60 * 1000;
    const EXPIRE_TIME =
      process.env.NODE_ENV === 'dev' ? devExpriesTime : prdExpriesTime;

    return {
      token: {
        access: accessToken,
        refresh: userInfo.token,
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME)
      }
    };
  }

  async verifyEmail(verifyToken: string) {
    // find user by verifyToken and emailVerificationExpiry

    const hashToken = updateRandomToken(verifyToken);
    const user = await this.userRepository.findOne({
      where: {
        emailVerificationToken: hashToken,
        emailVerificationExpiry: MoreThan(new Date())
      }
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
      message: 'Email is verified'
    };
  }

  checkAdmin() {
    return true;
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
        id: user.id
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn:
          process.env.NODE_ENV === 'dev'
            ? accessTkDevExpiresIn
            : accessTkPrdExpiresIn
      }
    );
  }

  generateRefereshToken(user: Pick<User, 'id'>) {
    return this.jwtService.sign(
      {
        id: user.id
      },
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: refreshTkExpiresIn
      }
    );
  }
}
