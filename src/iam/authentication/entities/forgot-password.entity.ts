import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueKey: string;

    @Column()
    expireTime: string;

    @Column({ default: false })
    used: boolean;

    @ManyToOne(type => User, { eager: true })
    user: User;
}
