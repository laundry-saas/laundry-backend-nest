import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Config } from 'src/libs/configs/constants.config';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Config.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const userId = payload.sub;
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      delete user.password;
      return user;
    } catch (error) {
      return payload;
    }
  }
}
