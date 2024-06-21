import {
  Controller,
  Get,
  Param,
  Req,
  UseGuards,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  // <-- REST APIs USER -->
  @UseGuards(AuthenticationGuard)
  @Get('my-profile')
  async getMyProfile(@Req() req: Request) {
    return this.userService.getMyProfile(req.user['sub']);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':username')
  async getUserProfile(@Param('username') username: string) {
    return this.userService.getUserProfile(username);
  }

  // <-- START FOLLOW -->
  @UseGuards(AuthenticationGuard)
  @Patch('follow/:followId')
  async followOrUnfollowUser(
    @Req() req: Request,
    @Param('followId') followId: ObjectId,
  ) {
    return this.userService.followOrUnfollowUser(req.user['sub'], followId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('follow/followings')
  async getAllUserFollowings(@Req() req: Request, @Query() query: any) {
    return this.userService.getAllUserFollowings(req.user['sub'], query);
  }

  // <-- START BLOCK -->
  @UseGuards(AuthenticationGuard)
  @Patch('block/:blockId')
  async addUserToBlockList(
    @Req() req: Request,
    @Param('blockId') blockId: ObjectId,
  ) {
    return this.userService.addUserToBlockList(req.user['sub'], blockId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('unblock/:unblockId')
  async removeUserFromBlockList(
    @Req() req: Request,
    @Param('unblockId') unblockId: ObjectId,
  ) {
    return this.userService.removeUserFromBlockList(req.user['sub'], unblockId);
  }
}
