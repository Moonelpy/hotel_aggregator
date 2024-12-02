import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ID } from 'src/types/CommonTypes';

export class CreateSupportRequestDto {
    @IsMongoId()
    user: ID;

    @IsNotEmpty()
    text: string;
}
