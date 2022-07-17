import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/auth/dto/SignUp.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      return undefined;
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async findByUsername(username: string): Promise<UserDocument | undefined> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      return undefined;
    }

    return user;
  }

  async createUser(userData: SignUpDto): Promise<UserDocument> {
    return this.userModel.create(userData);
  }
}
