import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    InternalServerErrorException,
    forwardRef,
} from '@nestjs/common';
import IUserService from './interfaces/IUserService';
import SearchUserParams from './interfaces/SearchUserParams';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/CommonTypes';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService implements IUserService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService,
        @InjectModel(User.name)
        private userModel: Model<User>,
    ) {}

    async create(user: RegisterUserDto): Promise<User> {
        // проверка на существование юзера с таким email
        const isUserAlreadyRegistrated = await this.userModel.findOne({
            email: user.email,
        });
        if (isUserAlreadyRegistrated) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }

        // генерация хеша пароля
        const password = user.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        user.passwordHash = passwordHash;

        const newUser = await this.userModel.create(user);

        // удаление хеша пароля из ответа
        const userWithoutPasswordHash = { ...newUser.toObject() };
        delete userWithoutPasswordHash.passwordHash;

        return userWithoutPasswordHash;
    }

    findById(id: ID): Promise<User> {
        const user = this.userModel.findById(id);
        return user;
    }

    findByEmail(email: string): Promise<User> {
        const user = this.userModel.findOne({ email }).lean();
        return user;
    }

    // При поиске IUserService.findAll() поля email, name и contactPhone должны проверяться на частичное совпадение.
    findAll(params: SearchUserParams): Promise<User[]> {
        let { limit, offset, email, name, contactPhone } = params;

        limit = limit || 5;
        offset = offset || 0;
        email = email || '';
        name = name || '';
        contactPhone = contactPhone || '';

        const query: any = {};

        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (contactPhone) {
            query.contactPhone = { $regex: contactPhone, $options: 'i' };
        }

        try {
            const users = this.userModel.find(query).skip(offset).limit(limit);
            return users;
        } catch (e) {
            throw new InternalServerErrorException(
                'Не удалось выполнить поиск пользователей',
            );
        }
    }
}
