import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Organization
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    email: string;

    @JoinTable()
    @OneToMany(type => User, user => user.organization)
    user: User[];
}
