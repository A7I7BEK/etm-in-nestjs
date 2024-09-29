import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueId: string;

    @ManyToOne(type => User, { eager: true })
    user: User;

    @Column()
    createdAt: string;

    @Column({ default: false })
    completed: boolean;
}
