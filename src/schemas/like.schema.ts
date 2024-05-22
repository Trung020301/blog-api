import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Post } from './post.schema';
import { User } from './user.schema';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Post | Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
