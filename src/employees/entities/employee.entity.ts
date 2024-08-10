import { User } from 'src/users/entities/user.entity';
import { Column, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

export class Employee
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    middleName: string;

    @Column({ nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    photoUrl: string;

    @OneToOne(type => User, user => user.employee)
    @JoinColumn()
    user: Relation<User>;
}
