import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // can be used in the future: e.g. 'Create User'

    @Column({ unique: true })
    codeName: string;
}
