import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
    ) {}

    async validateUser(email: string, password: string) {

    }
}
