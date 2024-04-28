import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { PayloadAuthDto } from './dto/PayloadAuthDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(payloadAuthDto: PayloadAuthDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      username: payloadAuthDto.username,
    });
    if (existingUser) {
      throw new HttpException('User already exists', 400);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payloadAuthDto.password, salt);
    const newUser = new this.userModel({
      ...payloadAuthDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async validateUser(payloadAuthDto: PayloadAuthDto) {
    const findUser = await this.userModel
      .findOne({
        username: payloadAuthDto.username,
      })
      .select('+password');
    if (!findUser) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      payloadAuthDto.password,
      findUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = findUser.toJSON();
    return {
      access_token: await this.jwtService.signAsync(result),
    };
  }
}
