import { ObjectId } from 'mongoose';
import { Paginator } from 'src/utils/pagination/paginate';

export type UserProfileType = {
  details: Record<string, any>;
  posts: ObjectId[];
};

export interface AllUserFollowingsType extends Paginator {
  _id: ObjectId;
  username: string;
  details: Record<string, any>;
}
