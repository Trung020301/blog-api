import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';
import { EnumRoles } from 'src/lib/enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop(
    raw({
      displayName: {
        type: String,
        default: null,
      },
      avtUrl: {
        type: String,
        default: 'https://www.gravatar.com/avatar/',
      },
      bio: { type: String, default: null },
      coverImage: { type: String, default: null },
      live: {
        type: String,
        default: null,
      },
      whereFrom: {
        type: String,
        default: null,
      },
      birthday: {
        type: Date,
        default: null,
      },
    }),
  )
  details: Record<string, any>;

  @Prop({ default: [], type: Types.ObjectId, ref: 'Post' })
  posts: ObjectId[];

  @Prop({ enum: EnumRoles, default: EnumRoles.USER })
  role: string;

  @Prop({ default: [], type: Types.ObjectId, ref: 'User' })
  following: ObjectId[];

  @Prop({ default: [], type: Types.ObjectId, ref: 'User' })
  followers: ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: [], type: Types.ObjectId, ref: 'User' })
  blockedUsers: ObjectId[];

  @Prop()
  refreshToken: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
