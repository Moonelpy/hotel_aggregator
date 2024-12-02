import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    CLIENT = 'client',
    ADMIN = 'admin',
    MANAGER = 'manager',
}

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.CLIENT,
        required: true,
    })
    role: string;

    @Prop()
    contactPhone: string;

    @Prop()
    passwordHash: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
