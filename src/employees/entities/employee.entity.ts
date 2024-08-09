import { Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
