import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Resource // Cannot be named File because it's a reserved keyword
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

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}