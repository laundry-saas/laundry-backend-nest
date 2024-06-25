import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../libs/prisma/prisma.client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Config } from 'src/libs/configs/constants.config';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login({ email, password }: LoginDto) {
    const foundUser = await this.prisma.user.findFirst({ where: { email } });
    if (!foundUser) {
      throw new ForbiddenException('Invalid user: User not found');
    }

    const validPassword = await argon.verify(foundUser.password, password);
    if (!validPassword) {
      throw new ForbiddenException('Invalid user: Invalid password');
    }

    return this.generateJwtToken(foundUser);
  }

  async generateJwtToken(newUser: any) {
    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: Config.JWT_SECRET,
      expiresIn: Config.JWT_EXPIRATION,
    });

    return { access_token };
  }
}
