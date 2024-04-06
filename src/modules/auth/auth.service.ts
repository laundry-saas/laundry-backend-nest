import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../../libs/prisma/prisma.client';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService){}

  async registerUser({email, password, role}: CreateAuthDto) {
    const hashedPassword = await argon.hash(password)
    const newUser = this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    })
    
    return newUser;
  }
}
