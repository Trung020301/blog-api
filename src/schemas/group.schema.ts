import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument, ObjectId } from 'mongoose';

export type GroupDocument = HydratedDocument<Group>;

@Schema()
export class Group {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  listUser: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  admin: Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isPrivate: boolean;

  @Prop({ type: Boolean, default: false })
  approvalRequired: boolean;

  @Prop({ type: Boolean, default: false })
  postApprovalRequired: boolean;

  @Prop({ type: Types.ObjectId, ref: 'GroupPost' })
  posts: ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
