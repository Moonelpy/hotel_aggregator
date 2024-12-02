import { IsISO8601, IsMongoId } from 'class-validator';

export class MarkMessagesAsReadDto {
    @IsMongoId()
    user: string;

    @IsMongoId()
    supportRequest: string;

    @IsISO8601()
    createdBefore: Date;
}
