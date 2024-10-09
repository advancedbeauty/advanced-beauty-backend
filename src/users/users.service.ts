import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserZodDto, UserUpdateDto } from 'src/zod/user.zod';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserZodDto): Promise<User> {
    // Ensure required fields are present
    if (!data.firstName || !data.lastName || !data.email) {
      throw new Error('First name, last name, and email are required');
    }

    let hashedPassword: string;

    if (data.password) {
      hashedPassword = await bcryptjs.hash(data.password, 10);
    }

    const userData: Prisma.UserCreateInput = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || null,
      avatarUrl: data.avatarUrl || null,
      password: hashedPassword || null,
      role: data.role || 'USER',
      hashedRefreshToken: data.hashedRefreshToken || null,
      emailVerification: data.emailVerification || 'UNVERIFIED',
      phoneVerification: data.phoneVerification || 'UNVERIFIED',
    };

    return this.prisma.user.create({ data: userData });
  }

  async update(id: string, data: UserUpdateDto): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      throw new Error('Failed to find user by email');
    }
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async remove(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
