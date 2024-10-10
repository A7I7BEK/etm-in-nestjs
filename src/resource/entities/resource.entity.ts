import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resource
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    name: string;

    @Column()
    filename: string;

    @Column()
    mimetype: string;

    @Column()
    size: number;

    @Column()
    sizeCalculated: string;

    @Column()
    createdAt: Date;

    @Column()
    now: Date; // Updated at
}