import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinTable()
    @ManyToMany(type => Employee, { eager: true })
    employees: Employee[];

    @ManyToOne(type => Employee, { eager: true })
    leader: Employee;

    @ManyToOne(type => Organization, { eager: true })
    organization: Organization;
}
