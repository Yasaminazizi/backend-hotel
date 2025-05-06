import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../model/entity/room.entity';
import { CreateRoomDto } from '../../dto/create-room.dto';

@Injectable()
export class RoomRepository {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  async getRoomById(id: string): Promise<Room | null> {
    return await this.roomRepository.findOne({ where: { id } }) || null;
  }

  async updateRoom(id: string, updatedData: CreateRoomDto): Promise<Room | null> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) return null;
    this.roomRepository.merge(room, updatedData);
    return await this.roomRepository.save(room);
  }

  async deleteRoom(id: string): Promise<void> {
    await this.roomRepository.softDelete(id);
  }



  async getAllRooms(): Promise<Room[]> {
    return await this.roomRepository.find();

  }
}