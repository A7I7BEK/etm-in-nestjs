import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class OneTimePassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    otpId: string;

    @Column()
    otpCode: number;

    @Column()
    expireTime: string;

    @Column({ default: false })
    used: boolean;

    @OneToOne(type => User)
    @JoinColumn()
    user: Relation<User>;
}
