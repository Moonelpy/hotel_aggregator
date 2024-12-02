import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}

    matchRoles(availableRoles: string[], userRole: string) {
        if (availableRoles.includes(userRole)) {
            return true;
        } else {
            return false;
        }
    }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        const isMatchPassword = await bcrypt.compare(pass, user.passwordHash);
        if (user && isMatchPassword) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
}
