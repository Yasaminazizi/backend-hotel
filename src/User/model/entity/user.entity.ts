import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';
import { Role } from './role.entity';  
import { Reservation } from '../../../Hotel/model/entity/reservation.entity'; 
import { UserRole } from '../enum/role.enum';

@Entity()
export class User {

  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  phoneNumber: string;  

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Exclude()
  updatedAt: Date;
  
  @DeleteDateColumn()
  @Expose()
  deletedAt: Date;

  // @ManyToMany(() => Role)
  // @JoinTable()
  // roles: Role[];
  

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
}