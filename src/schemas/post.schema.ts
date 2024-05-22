import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument, ObjectId } from 'mongoose';
import { Enumvisibility, TypeInteractions } from 'src/lib/enum';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: ObjectId;

  @Prop({ default: Enumvisibility.PUBLIC, enum: Enumvisibility })
  visibility: string;

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: [], type: mongoose.Schema.Types.ObjectId, ref: 'Like' })
  likes: ObjectId[];

  @Prop({ default: [], type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comments: ObjectId[];

  @Prop({ default: [] })
  keywords: string[];

  @Prop({ default: [] })
  interactions: {
    type: TypeInteractions;
    user: mongoose.Schema.Types.ObjectId;
    date: Date;
  }[];

  @Prop()
  tags: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
