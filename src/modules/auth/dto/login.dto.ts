import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'johndoe@yopmail.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ default: '!Pass4sure' })
  @IsNotEmpty()
  password: string;
}
