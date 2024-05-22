import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { PayloadAuthDto } from './dto/PayloadAuthDto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/lib/constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(payloadAuthDto: PayloadAuthDto): Promise<any> {
    const existingUser = await this.userModel.findOne({
      username: payloadAuthDto.username,
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashData(payloadAuthDto.password);
    const newUser = new this.userModel({
      ...payloadAuthDto,
      password: hashedPassword,
    });
    await newUser.save();
    const tokens = await this.getTokens(newUser._id, newUser.role);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return {
      access_token: tokens.accessToken,
    };
  }

  async validateUser(payloadAuthDto: PayloadAuthDto): Promise<any> {
    const existUser = await this.userModel
      .findOne({
        username: payloadAuthDto.username,
      })
      .select('+password');
    if (!existUser) {
      return null;
    }
    const isPasswordValid = await bcrypt.compare(
      payloadAuthDto.password,
      existUser.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const tokens = await this.getTokens(existUser._id, existUser.role);
    await this.updateRefreshToken(existUser._id, tokens.refreshToken);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = existUser.toJSON();
    return result;
  }

  async signIn(user: any) {
    const tokens = await this.getTokens(user._id, user.role);
    return { access_token: tokens.accessToken };
  }

  async signOut(user: User) {
    await this.userModel.findByIdAndUpdate(user, { refreshToken: null });
  }

  async refreshTokens(
    userId: Types.ObjectId,
    refreshToken: string,
  ): Promise<any> {
    const user = await this.userModel.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return {
      access_token: tokens.accessToken,
    };
  }

  hashData(data: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(data, salt);
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: Types.ObjectId, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          expiresIn: '15m',
          secret: JWT_SECRET,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role,
        },
        {
          expiresIn: '7d',
          secret: JWT_SECRET,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
