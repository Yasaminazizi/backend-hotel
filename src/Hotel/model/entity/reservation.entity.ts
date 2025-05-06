import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from '../../../User/model/entity/user.entity';
import { Room } from './room.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Room, (room) => room.reservations)
  room: Room;

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
}