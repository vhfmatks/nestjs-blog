import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  /**
   * @param username
   * @param password
   */
  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByName(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    const comparePwd = await bcrypt.compare(password, user.password);

    // await bcrypt.hash(this.password, 10);
    if (user && !comparePwd) {
      throw new UnauthorizedException('password failed')
    }
    if (user && comparePwd) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }


  async login(user: any) {
    const payload = { ...user }

    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
