import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Role } from '../enums/role.enum';

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

    @ManyToOne(type => Organization, organization => organization.users)
    organization: Organization;

    @OneToOne(type => Employee, employee => employee.user)
    employee: Relation<Employee>;

    @Column({ default: false })
    systemAdmin: boolean;
}
