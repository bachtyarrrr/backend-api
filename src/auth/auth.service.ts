import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private tokenBlacklist: Set<string> = new Set();
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

    async signIn(username, password) {
        const user = await this.userService.findOne(username);
        if (!user || !(await this.validatePassword(password, user.password))) {
        throw new UnauthorizedException();
        }
        
        const payload = { sub: user.id, username: user.username };
        return {
        access_token: await this.jwtService.signAsync(payload),
        };
    }

    async logout(token: string): Promise<void> {
        // Add the token to the blacklist
        this.tokenBlacklist.add(token);
    }

    private async validatePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
      }

      async isTokenBlacklisted(token: string): Promise<boolean> {
        // Check if the token is in the blacklist
        return this.tokenBlacklist.has(token);
      }
  }