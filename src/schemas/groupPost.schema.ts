import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, ObjectId } from 'mongoose';
import { Post } from './post.schema';
import { EnumPostGroupType } from 'src/lib/enum';

export type GroupPostDocument = HydratedDocument<GroupPost>;

@Schema()
export class GroupPost extends Post {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  groupId: ObjectId;

  @Prop({ enum: EnumPostGroupType, default: EnumPostGroupType.PENDING })
  status: string;
}

export const GroupPostSchema = SchemaFactory.createForClass(GroupPost);
