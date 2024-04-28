import { IsNotEmpty, IsString } from 'class-validator';

export class PayloadAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
