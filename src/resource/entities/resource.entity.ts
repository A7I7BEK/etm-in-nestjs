import { Exclude } from 'class-transformer';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceStatus } from '../enums/resource-status.enum';

@Entity()
export class Resource // Cannot be named File because it's a reserved keyword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
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

    @Column({
        type: 'enum',
        enum: ResourceStatus,
        default: ResourceStatus.TEMP,
    })
    @Exclude()
    status: ResourceStatus;

    @ManyToOne(type => Organization, { onDelete: 'SET NULL' })
    organization: Organization;
}