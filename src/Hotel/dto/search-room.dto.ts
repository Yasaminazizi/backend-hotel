import { Type } from 'class-transformer';


export class SearchRoomDto {
  roomId: string;

  @Type(() => Date)
  checkIn: Date;

  @Type(() => Date)
  checkOut: Date;
}