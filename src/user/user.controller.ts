import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    NotFoundException,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from '@prisma/client';
  
  @Controller('users')
  export class UserController {
    constructor(private readonly userService: UserService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createUserDto: CreateUserDto): Promise<Omit<User, 'hashedPassword'>> {
      return this.userService.createUser(createUserDto);
    }
  
    @Get()
    async findAll(@Query() query: {
      skip?: number;
      take?: number;
      where?: string;
      orderBy?: string;
    }) {
      const { skip, take, where, orderBy } = query;
      return this.userService.findAll({
        skip: skip ? Number(skip) : undefined,
        take: take ? Number(take) : undefined,
        where: where ? JSON.parse(where) : undefined,
        orderBy: orderBy ? JSON.parse(orderBy) : undefined,
      });
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Omit<User, 'hashedPassword'>> {
      return this.userService.findOne(id);
    }
  
    @Get('email/:email')
    async findByEmail(@Param('email') email: string): Promise<Omit<User, 'hashedPassword'>> {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user;
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto,
    ): Promise<Omit<User, 'hashedPassword'>> {
      return this.userService.update(id, updateUserDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async remove(@Param('id') id: string): Promise<void> {
      await this.userService.remove(id);
    }
  }