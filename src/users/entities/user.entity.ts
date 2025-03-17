import { Exclude } from 'class-transformer';
import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Role } from 'src/roles/entity/role.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { LANGUAGE_DEFAULT } from '../language/language.constants';
import { ILanguage } from '../language/language.interface';
import { UserMark } from '../marks/user-mark.interface';

@Entity()
export class User // ADVICE: in the future, merge with Employee
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userName: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    phoneNumber: string;

    @Column('json')
    marks: UserMark; // BINGO: special type

    @Column({ type: 'json', default: LANGUAGE_DEFAULT }) // BINGO: set default
    language: ILanguage; // BINGO: special type

    @JoinTable()
    @ManyToMany(type => Role, a => a.users)
    roles: Role[];

    @ManyToOne(type => Organization, a => a.users, { onDelete: 'CASCADE' })
    organization: Organization;

    @OneToOne(type => Employee, a => a.user)
    employee: Relation<Employee>;
}
