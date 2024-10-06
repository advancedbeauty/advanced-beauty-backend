import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { Role, VerificationStatus } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @IsEnum(VerificationStatus)
  emailVerification?: VerificationStatus;

  @IsOptional()
  @IsEnum(VerificationStatus)
  phoneVerification?: VerificationStatus;
}