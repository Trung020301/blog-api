import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { TypeInteractions } from 'src/lib/enum';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  owner: Types.ObjectId;

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: [], type: Types.ObjectId, ref: 'Like' })
  likes: Types.ObjectId[];

  @Prop({ default: [], type: Types.ObjectId, ref: 'Comment' })
  comments: Types.ObjectId[];

  @Prop({ default: [] })
  keywords: string[];

  @Prop({ default: [] })
  interactions: {
    type: TypeInteractions;
    user: Types.ObjectId;
    date: Date;
  }[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
