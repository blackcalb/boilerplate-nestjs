import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/users/user.schema';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/SignUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getUserInfo(userId: string) {
    const user = await this.usersService.findById(userId);
    const { username, email, name, pictureUrl } = user;
    return { username, email, name, pictureUrl };
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Partial<UserDocument> | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && user.password === pass) {
      const { email, _id: id } = user;
      return { email, id };
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(user: any) {
    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUp(userData: SignUpDto) {
    if (await this.usersService.findByEmail(userData.email)) {
      //TODO: def error codes/msgs internally
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Account with this email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.usersService.createUser(userData);
    const { _id: id, username, email } = user;
    return { id, username, email };
  }
}
