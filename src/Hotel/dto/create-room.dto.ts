import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  // location به صورت ساده در همین کلاس تعریف شده
  location: {
    floor: number;
    beds: number;
    description: string;
  };

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  @IsNotEmpty()
  hotelId: string;
}
