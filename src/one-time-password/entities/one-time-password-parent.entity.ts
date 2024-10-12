import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OtpSendingOptions } from '../interfaces/otp-sending-options.interface';
import { OneTimePassword } from './one-time-password.entity';

@Entity()
export class OneTimePasswordParent
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueId: string;

    @Column('json')
    options: Partial<OtpSendingOptions>; // BINGO

    @ManyToOne(type => User, { eager: true })
    user: User;

    @OneToMany(type => OneTimePassword, children => children.parent)
    children: OneTimePassword[];
}
