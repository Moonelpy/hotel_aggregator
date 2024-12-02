import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { Message } from './message.schema';
import { getMskDate } from 'src/helpers/dateHelper';

export type SupportRequestDocument = HydratedDocument<SupportRequest>;

@Schema({ timestamps: true })
export class SupportRequest {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    })
    user: User;

    @Prop({ required: true, default: getMskDate() })
    sentAt: Date;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
        default: [],
    })
    messages: Message[];

    @Prop({ default: true })
    isActive: boolean;
}

export const SupportRequestSchema =
    SchemaFactory.createForClass(SupportRequest);
