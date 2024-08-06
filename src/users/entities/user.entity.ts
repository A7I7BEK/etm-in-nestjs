import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
import { Organization } from 'src/organizations/entities/organization.entity';

@Entity()
export class User
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userName: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phoneNumber: string;

    @Column()
    password: string;

    @Column({ enum: Role, default: Role.Regular })
    role: Role;

    @ManyToOne(type => Organization, organization => organization.user)
    organization: Organization;
}
