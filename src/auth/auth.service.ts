import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);
        if(!user) {
            throw new UnauthorizedException("User not found!");
        }
        const isPasswordMatch = await compare(password, user.password);
        if(!isPasswordMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }
        return { id: user.id };
    }
}
