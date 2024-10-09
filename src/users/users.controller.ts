import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UsePipes } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { userSchema, userUpdateSchema, UserZodDto, UserUpdateDto } from '../zod/user.zod';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(userSchema))
  async create(@Body() createUserDto: UserZodDto): Promise<User> {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message || 'Failed to create user', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(userUpdateSchema))
  async update(@Param('id') id: string, @Body() updateUserDto: UserUpdateDto): Promise<User> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(error.message || 'Failed to update user', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.BAD_REQUEST);
    }
  }
}
