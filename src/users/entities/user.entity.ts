import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { LANGUAGE_DEFAULT } from '../language/language.constants';
import { ILanguage } from '../language/language.interface';
import { UserMark } from '../marks/user-mark.interface';

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

    @Column('json')
    marks: UserMark;

    @Column({ default: LANGUAGE_DEFAULT, type: 'json' })
    language: ILanguage;

    @JoinTable()
    @ManyToMany(type => Role, role => role.users)
    roles: Role[];

    @ManyToOne(type => Organization, organization => organization.users)
    organization: Organization;

    @OneToOne(type => Employee, employee => employee.user)
    employee: Relation<Employee>;
}
