import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Employee
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName: string;

    @Column({ nullable: true })
    birthDate: Date;

    @Column({ nullable: true })
    photoUrl: string;

    @OneToOne(type => User, user => user.employee)
    @JoinColumn()
    user: Relation<User>;
}
