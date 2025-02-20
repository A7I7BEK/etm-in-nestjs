import { Employee } from 'src/employees/entities/employee.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Group
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @JoinTable()
    @ManyToMany(type => Employee)
    employees: Employee[];

    @ManyToOne(type => Employee, { onDelete: 'SET NULL' })
    leader: Employee;

    @OneToMany(type => Project, a => a.group)
    projects: Project[];

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}
