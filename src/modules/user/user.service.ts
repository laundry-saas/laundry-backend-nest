import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/libs/prisma/prisma.client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async validateUserExists(email: string): Promise<void> {
    const result = await this.prisma.user.count({ where: { email } });
    if (result > 0) {
      throw new ForbiddenException('User already exists');
    }
  }
  
  create({ email, password, role }: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
