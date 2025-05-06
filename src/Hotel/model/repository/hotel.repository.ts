// hotel.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotel } from '../../model/entity/hotel.entity';
import { CreateHotelDto } from '../../dto/create-hotel.dto';
import { UpdateHotelDto } from '../../dto/update-hotel.dto';

@Injectable()
export class HotelRepository {
  constructor(
    @InjectRepository(Hotel)
    private readonly hotelRepository: Repository<Hotel>,
  ) {}

  async createHotel(createHotelDto: CreateHotelDto): Promise<Hotel> {
    const hotel = this.hotelRepository.create(createHotelDto);
    return await this.hotelRepository.save(hotel);
  }

  async getHotelById(id: string): Promise<Hotel | null> {
    return await this.hotelRepository.findOne({ where: { id } }) || null;
  }

  async updateHotel(id: string, updatedData: UpdateHotelDto): Promise<Hotel | null> {
    const hotel = await this.hotelRepository.findOne({ where: { id } });
    if (!hotel) return null;
    this.hotelRepository.merge(hotel, updatedData);
    return await this.hotelRepository.save(hotel);
  }

  async deleteHotel(id: string): Promise<void> {
    await this.hotelRepository.softDelete(id);
  }

  async getAllHotels(): Promise<Hotel[]> {
    return await this.hotelRepository.find();
  }
}