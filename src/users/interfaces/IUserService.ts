import { ObjectId } from 'mongoose';
import { User } from '../schemas/user.schema';
import SearchUserParams from './SearchUserParams';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { ID } from "../../types/CommonTypes";

export default interface IUserService {
    create(data: RegisterUserDto): Promise<User>;
    findById(id: ID): Promise<User>;
    findByEmail(email: string): Promise<User>;
    findAll(params: SearchUserParams): Promise<User[]>;
}
