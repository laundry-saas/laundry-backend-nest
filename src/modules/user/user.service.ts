import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';
import * as argon from 'argon2';
import { UserEntity } from './entities/user.entity';
import { UserRole } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUserEmailExists(email: string): Promise<void> {
    const result = await this.prisma.user.count({ where: { email } });
    if (result > 0) {
      throw new ForbiddenException('User email already exists');
    }
  }
  async validateUserPhoneExists(phone: string): Promise<void> {
    const result = await this.prisma.user.count({ where: { phone } });
    if (result > 0) {
      throw new ForbiddenException('User phone already exists');
    }
  }

  async create({ email, password, role, phone }: CreateUserDto) {
    const hashedPassword = await argon.hash(password);
    return this.prisma.user.create({
      data: {
        phone,
        email,
        password: hashedPassword,
        role,
      },
    });
  }
  getMe(user: UserEntity) {
    return this.prisma.user.findFirst({
      where: { id: user.id },
      include: {
        vendor: user.role === UserRole.VENDOR,
        customer: user.role === UserRole.CUSTOMER,
      },
    });
  }
}
