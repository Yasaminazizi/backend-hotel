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

  // location به صورت یک شیء تعریف می‌شود
  location: {
    floor: number;
    beds: number;
    description: string;
  };

  @IsBoolean()
  isAvailable: boolean;

  @IsString()
  @IsNotEmpty()
  hotelId: string;  // ID for the hotel (you may need this to associate the room with a hotel)
}