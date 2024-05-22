import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Post } from './post.schema';
import { User } from './user.schema';

export type ShareDocument = HydratedDocument<Share>;

@Schema()
export class Share {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Post | Types.ObjectId;
}

export const ShareSchema = SchemaFactory.createForClass(Share);
