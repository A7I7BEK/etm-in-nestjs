import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OneTimePassword } from './one-time-password.entity';

@Entity()
export class OneTimePasswordParent
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueId: string;

    @OneToMany(type => OneTimePassword, children => children.parent)
    children: OneTimePassword[];

    @ManyToOne(type => User, { eager: true })
    user: User;
}
