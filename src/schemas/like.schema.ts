import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post: Types.ObjectId;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
