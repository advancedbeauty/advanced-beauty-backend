import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, UsersService, PrismaService, LocalStrategy],
})
export class AuthModule {}
