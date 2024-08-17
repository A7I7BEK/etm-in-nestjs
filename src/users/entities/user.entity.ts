import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Role } from '../enums/role.enum';
import { LANGUAGE_LIST } from '../language/language.constant';

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

    @Column({ default: false })
    active: boolean;

    @Column({ default: false })
    systemAdmin: boolean;

    @Column({ default: LANGUAGE_LIST[ 0 ].code })
    language: string;

    @Column({ enum: Role, default: Role.Regular })
    role: Role;

    @ManyToOne(type => Organization, organization => organization.users)
    organization: Organization;

    @OneToOne(type => Employee, employee => employee.user)
    employee: Relation<Employee>;
}
