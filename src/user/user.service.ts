import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User, Role, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const { password, ...userData } = createUserDto;
    
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        emailVerification: true,
        phoneVerification: true,
        hashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ users: Omit<User, 'hashedPassword'>[]; total: number }> {
    const { skip, take, where, orderBy } = params || {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phone: true,
          avatarUrl: true,
          emailVerification: true,
          phoneVerification: true,
          hashedRefreshToken: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  async findOne(id: string): Promise<Omit<User, 'hashedPassword'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        emailVerification: true,
        phoneVerification: true,
        hashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<Omit<User, 'hashedPassword'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        emailVerification: true,
        phoneVerification: true,
        hashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const { password, ...updateData } = updateUserDto;

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await this.hashPassword(password);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(hashedPassword && { hashedPassword }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        emailVerification: true,
        phoneVerification: true,
        hashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async remove(id: string): Promise<Omit<User, 'hashedPassword'>> {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        phone: true,
        avatarUrl: true,
        emailVerification: true,
        phoneVerification: true,
        hashedRefreshToken: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { hashedPassword: true },
    });

    if (!user) {
      return false;
    }

    return bcrypt.compare(password, user.hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
}