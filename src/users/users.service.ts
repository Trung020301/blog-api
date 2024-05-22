import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import * as jwt from 'jsonwebtoken';

import { AllUserFollowingsType, UserProfileType } from 'src/lib/type';
import { User } from 'src/schemas/user.schema';
import { Paginator } from 'src/utils/pagination/paginate';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // <-- GET MY PROFILE -->
  async getMyProfile(userId: ObjectId): Promise<User> {
    return this.userModel.findById(userId);
  }

  // <-- GET USER PROFILE -->
  async getUserProfile(
    username: string,
    token?: string,
  ): Promise<UserProfileType> {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const result: UserProfileType = {
      details: user.details,
      posts: user.posts,
    };

    if (token) {
      const decoded = jwt.decode(token.split(' ')[1]);
      const userId = decoded['sub'];
      const isBlocked =
        user.blockedUsers.findIndex((id) => id.toString() === userId) !== -1;
      if (isBlocked) {
        throw new HttpException('User not found', 404);
      }
    }

    return result;
  }

  // <-- FOLLOW OR UNFOLLOW A USER -->
  async followOrUnfollowUser(
    userId: ObjectId,
    followId: ObjectId,
  ): Promise<void> {
    const userToFollow = await this.userModel.findById(followId);
    if (!userToFollow) {
      throw new HttpException('User to follow not found', 404);
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (userId === followId) {
      throw new HttpException('You cannot follow yourself', 400);
    }

    const isFollowing = user.following.includes(followId);
    if (isFollowing) {
      await Promise.all([
        user.updateOne({ $pull: { following: followId } }),
        userToFollow.updateOne({ $pull: { followers: userId } }),
      ]);
    } else {
      await Promise.all([
        user.updateOne({ $push: { following: followId } }),
        userToFollow.updateOne({ $push: { followers: userId } }),
      ]);
    }
  }

  // <-- ADD USER TO BLOCK LIST -->
  async addUserToBlockList(userId: ObjectId, blockId: ObjectId): Promise<void> {
    if (userId === blockId) {
      throw new HttpException('You cannot block yourself', 400);
    }
    const [user, userToBlock] = await Promise.all([
      this.userModel.findById(userId),
      this.userModel.findById(blockId),
    ]);
    if (!user || !userToBlock) {
      throw new HttpException('User not found', 404);
    }

    if (user.blockedUsers.includes(blockId)) {
      throw new HttpException('User already blocked', 400);
    }

    await Promise.all([
      user.updateOne({ $push: { blockedUsers: blockId } }),
      user.updateOne({ $pull: { following: blockId } }),
      userToBlock.updateOne({ $pull: { followers: userId } }),
    ]);
  }

  // <-- REMOVE USER FROM BLOCK LIST -->
  async removeUserFromBlockList(
    userId: ObjectId,
    blockId: ObjectId,
  ): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (!user.blockedUsers.includes(blockId)) {
      throw new HttpException('User not found in block list', 404);
    } else {
      await user.updateOne({ $pull: { blockedUsers: blockId } });
    }
  }

  // <-- GET ALl USER FOLLOWINGS -->
  async getAllUserFollowings(
    userId: ObjectId,
    options: { page: number; limit: number; sort?: any },
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    const filter = { _id: { $in: user.following } };
    const select = '_id username details';

    const paginator = new Paginator(this.userModel, filter, {
      ...options,
      select,
    });
    const result = await paginator.paginate();
    return result;
  }
}
