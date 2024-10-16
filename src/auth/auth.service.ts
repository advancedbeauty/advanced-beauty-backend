import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayload } from './types/auth-jwtPayload';
import refreshJwtConfig from './config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { CurrentUser } from './types/current-user';
import { Role } from './enum/roles.enum';
import { UserZodDto } from 'src/zod/user.zod';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @Inject(refreshJwtConfig.KEY) private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>
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

    async login(userId: string) {
        const {accessToken, refreshToken} = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken
        }
    }

    async generateTokens(userId: string) {
        const payload: AuthJwtPayload = {
            sub: userId,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload),
            this.jwtService.signAsync(payload, this.refreshTokenConfig)
        ]);
        return {
            accessToken,
            refreshToken
        }
    }

    async refreshToken(userId: string) {
        const {accessToken, refreshToken} = await this.generateTokens(userId);
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
        return {
            id: userId,
            accessToken,
            refreshToken
        }
    }

    async validateRefreshToken(userId: string, refreshToken: string) {
        const user = await this.userService.findOne(userId);
        if(!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException("Invalid Refresh Token");
        }
        const isRefreshTokenMatched = await argon2.verify(user.hashedRefreshToken, refreshToken);
        if(!isRefreshTokenMatched) {
            throw new UnauthorizedException("Invalid Refresh Token");
        }
        return {
            id: userId
        }
    }

    async signOut(userId: string) {
        await this.userService.updateHashedRefreshToken(userId, null);
    }

    async validateJwtUser(userId: string) {
        const user = await this.userService.findOne(userId);
        if(!user) {
            throw new UnauthorizedException("User not found");
        }
        const currentUser: CurrentUser = {
            id: user.id,
            role: user.role as Role,
        }
        return currentUser;
    }

    async validateGoogleUser(googleUser: UserZodDto) {
        const user = await this.userService.findByEmail(googleUser.email);
        if(user) {
            return user;
        }
        return await this.userService.create(googleUser);
    }
}
