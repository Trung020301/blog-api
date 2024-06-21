import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Post } from './post.schema';
import { EnumvisibilityUser } from 'src/lib/enum';

export type UserPostDocument = HydratedDocument<UserPost>;

@Schema()
export class UserPost extends Post {
  @Prop({ default: EnumvisibilityUser.PUBLIC, enum: EnumvisibilityUser })
  visibility: string;
}
