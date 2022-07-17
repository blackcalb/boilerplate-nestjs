import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  name: string;

  @Prop()
  pictureUrl: string;

  @Prop({ default: 'local' })
  loginMethod: 'google' | 'local';
}

export const UserSchema = SchemaFactory.createForClass(User);
