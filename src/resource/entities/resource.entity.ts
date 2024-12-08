import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
    updatedAt: Date;

    @Column()
    now: Date; // temporary for this project, must not exist

    @ManyToOne(type => Organization)
    organization: Organization;
}