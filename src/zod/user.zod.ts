import { z } from 'zod';

// Enum definitions
const RoleEnum = z.enum(['USER', 'ADMIN']);
const VerificationStatusEnum = z.enum(['UNVERIFIED', 'PENDING', 'VERIFIED']);

// Schema for creating a new user
export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  password: z.string().min(8).nullable().optional(),
  role: RoleEnum.optional(),
  hashedRefreshToken: z.string().nullable().optional(),
  isEmailVerified: VerificationStatusEnum.optional(),
  isPhoneVerified: VerificationStatusEnum.optional(),
}).strict();

export type UserZodDto = z.infer<typeof userSchema>;

// Schema for updating an existing user
export const userUpdateSchema = userSchema.partial();

export type UserUpdateDto = z.infer<typeof userUpdateSchema>;