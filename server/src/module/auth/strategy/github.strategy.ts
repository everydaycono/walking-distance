import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GITHUB_SOCIAL_LOGIN_CLIENT_ID'),
      clientSecret: configService.get<string>('GITHUB_SOCIAL_LOGIN_SECRET'),
      callbackURL: configService.get<string>(
        'GITHUB_SOCIAL_LOGIN_CALLBACK_URL'
      ),
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile) {
    console.log(process.env.GITHUB_SOCIAL_LOGIN_CALLBACK_URL, 'callback url');

    console.log(profile, 'github strategy profile');

    return profile;
  }
}
