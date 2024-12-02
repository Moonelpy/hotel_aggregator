import {
    Controller,
    Query,
    Get,
    UsePipes,
    ValidationPipe,
    Post,
    Body,
    UseGuards,
    Put,
    UseInterceptors,
    UploadedFiles,
    Param,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelRoomService } from './hotel-room.service';
import { HotelDto } from './dto/hotel.dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class HotelsController {
    constructor(
        private readonly hotelsService: HotelsService,
        private readonly hotelRoomService: HotelRoomService,
    ) {}

    // Основной API для поиска номеров
    @Get('/api/common/hotel-rooms')
    @UsePipes(ValidationPipe)
    searchRooms(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('hotelId') hotelId?: string,
    ) {
        return this.hotelRoomService.search({ limit, offset, hotelId });
    }

    // Получение подробной информации о номере
    @Get('/api/common/hotel-rooms/:id')
    @UsePipes(ValidationPipe)
    searchRoomById(@Param('id') id: string) {
        return this.hotelRoomService.findById(id);
    }

    // Добавление гостиницы администратором.
    @Post('/api/admin/hotels')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    createHotel(@Body() hotel: HotelDto) {
        return this.hotelsService.create(hotel);
    }

    // Получение списка гостиниц администратором.
    @Get('/api/admin/hotels')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    getHotelsList(
        @Query('limit') limit?: number,
        @Query('offset') offset?: number,
        @Query('title') title?: string,
    ) {
        return this.hotelsService.search({ limit, offset, title });
    }

    // Изменение описания гостиницы администратором.
    @Put('/api/admin/hotels/:id')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    updateHotel(@Query('id') id: string, @Body() hotel: HotelDto) {
        return this.hotelsService.update(id, hotel);
    }

    // Добавление номера гостиницы администратором.
    @Post('/api/admin/hotel-rooms')
    @UsePipes(ValidationPipe)
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    @UseInterceptors(FilesInterceptor('images'))
    createHotelRoom(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() body,
    ) {
        const imagePaths = images.map((image) => {
            return image.path;
        });
        const hotelRoomObject = {
            images: imagePaths,
            hotel: body.hotelId,
            description: body.description,
        };
        return this.hotelRoomService.create(hotelRoomObject);
    }

    // Изменение описания номера гостиницы администратором.
    @Put('/api/admin/hotel-rooms/:id')
    @UsePipes(ValidationPipe)
    @UseInterceptors(FilesInterceptor('images'))
    @Roles(['admin'])
    @UseGuards(RolesGuard)
    editHotelRoom(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() body,
        @Param('id') id: string,
    ) {
        const imagePaths = images.map((image) => {
            return image.path;
        });
        const hotelRoomObject = {
            images: imagePaths,
            hotel: body.hotelId,
            description: body.description,
            isEnabled: body.isEnabled,
        };
        return this.hotelRoomService.update(id, hotelRoomObject);
    }
}
