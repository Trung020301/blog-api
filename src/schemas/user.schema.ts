import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ default: 'https://www.gravatar.com/avatar/' })
  avatarUrl?: string;

  @Prop({ enum: ['admin', 'user'], default: 'user' })
  role: string;

  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
