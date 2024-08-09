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
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column({ enum: Role, default: Role.Regular })
    role: Role;

    @ManyToOne(type => Organization, organization => organization.user)
    organization: Organization;

    @Column({ default: false })
    systemAdmin: boolean;
}
