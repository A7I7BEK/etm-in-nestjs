import { Organization } from 'src/organizations/entities/organization.entity';
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
    options: Partial<OtpSendingOptions>; // BINGO: special type

    @ManyToOne(type => User, { onDelete: 'CASCADE' })
    user: User;

    @OneToMany(type => OneTimePassword, a => a.parent)
    children: OneTimePassword[];

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}
