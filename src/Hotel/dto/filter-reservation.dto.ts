import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ReservationStatus } from '../model/enum/status.enum';
import { Type } from 'class-transformer';

export class FilterReservationDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsUUID()
  @IsOptional()
  hotelId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}