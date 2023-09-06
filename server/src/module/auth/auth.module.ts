import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entity
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module';
import { GithubStrategy } from './strategy/github.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubStrategy]
})
export class AuthModule {}
