import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class ForgotPassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueKey: string;

    @Column()
    expireTime: Date;

    @Column({ default: false })
    used: boolean;

    @OneToOne(type => User)
    @JoinColumn()
    user: Relation<User>;
}
