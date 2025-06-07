import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,JoinColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from '../../../User/model/entity/user.entity';
import { Room } from './room.entity';
import { Hotel } from './hotel.entity'; 
import { ReservationStatus } from '../enum/status.enum';




@Entity()
export class Reservation {

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ACTIVE,
  })
  status: ReservationStatus;
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' }) 
  userId: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'userId' }) 
  user: User;

  @Column({ type: 'varchar' })
  roomId: string;

  @ManyToOne(() => Room, (room) => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @Column({ type: 'varchar' })
  hotelId: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.reservations)
  @JoinColumn({ name: 'hotelId' })
  hotel: Hotel;  

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  @Expose()
  updatedAt: Date;

  @DeleteDateColumn()
  @Expose()
  deletedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  checkInDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  checkOutDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  @Expose()
  expirationDate: Date;

  @Column({ type: 'int', default: 1 })
  quantity: number;
}