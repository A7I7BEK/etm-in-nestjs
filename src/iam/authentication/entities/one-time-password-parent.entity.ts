import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
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

    @OneToOne(type => User, { eager: true })
    @JoinColumn()
    user: Relation<User>;
}
