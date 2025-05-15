import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,JoinColumn } from 'typeorm'; 
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Room } from './room.entity'; 
import { Reservation } from './reservation.entity'; 

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({
    description: 'The geographical location of the hotel',
    example: { latitude: 40.7128, longitude: 74.0060 },
  })
  location: { latitude: number; longitude: number };

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn()
  @Expose()
  deletedAt: Date;

  @OneToMany(() => Room, (room) => room.hotel)
  rooms: Room[];
  
  @OneToMany(() => Reservation, (reservation) => reservation.hotel)
  reservations: Reservation[]; 
}