import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';


export class SearchRoomDto {
  @IsOptional()
  roomId: string;

  @Type(() => Date)
  @IsNotEmpty()
  checkIn: Date;

  @Type(() => Date)
  @IsNotEmpty()
  checkOut: Date;
}