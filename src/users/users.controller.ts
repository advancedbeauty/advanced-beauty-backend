import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UsePipes, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { userSchema, userUpdateSchema, UserZodDto, UserUpdateDto } from '../zod/user.zod';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorators';
import { Role } from '../auth/enum/roles.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    return await this.usersService.findOne(req.user.id)
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

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<User> {
    try {
      return await this.usersService.remove(id);
    } catch (error) {
      throw new HttpException('Failed to delete user', HttpStatus.BAD_REQUEST);
    }
  }
}
