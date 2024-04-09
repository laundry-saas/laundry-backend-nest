import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
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

  async registerUser({ email, password, role }: CreateAuthDto) {
    await this.userService.validateUserExists(email);
    const hashedPassword = await argon.hash(password);
    const newUser = await this.userService.create({
      email,
      password: hashedPassword,
      role,
    });

    const payload = {
      sub: newUser.id,
      email: newUser.email,
      role: newUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: Config.JWT_SECRET,
      expiresIn: Config.JWT_EXPIRATION,
    });

    return {
      access_token,
    };
  }

  async login({ email, password }: LoginDto) {
    const foundUser = await this.prisma.user.findFirst({ where: { email } });
    if (!foundUser) {
      throw new ForbiddenException('Invalid user: User not found');
    }

    const validPassword = await argon.verify(foundUser.password, password);
    console.log('valid password: ' + validPassword);
    if (!validPassword) {
      throw new ForbiddenException('Invalid user: Invalid password');
    }
    const payload = {
      sub: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
