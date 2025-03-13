import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueId: string;

    @ManyToOne(type => User, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @Column()
    createdAt: Date;

    @Column({ default: false })
    completed: boolean;
}
