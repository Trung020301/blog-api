import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, ObjectId } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema()
export class Chat {
  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  author: ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
