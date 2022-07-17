import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get('AUTH_GOOGLE_CLIENTID'), //process.env.GOOGLE_CLIENT_ID,
      clientSecret: configService.get('AUTH_GOOGLE_SECRET'),
      callbackURL: configService.get('AUTH_GOOGLE_REDIRECT'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    // refreshToken: string,
    _: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;
    const user = {
      userId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    const userDB = await this.usersService.findByEmail(user.email);
    if (!user) {
      const newUser = await this.usersService.createUser({
        email: emails[0].value,
        username: emails[0].value,
        name: `${name.givenName} ${name.familyName}`,
        loginMethod: 'google',
      });
      done(null, { ...user, _id: newUser._id });
    }
    done(null, { ...user, _id: userDB._id });
  }
}
