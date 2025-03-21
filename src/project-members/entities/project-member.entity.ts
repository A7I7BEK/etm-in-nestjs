import { Employee } from 'src/employees/entities/employee.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectMember
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isTeamLeader: boolean = false;

    @ManyToOne(type => Employee, { eager: true, onDelete: 'CASCADE' })
    employee: Employee;

    @ManyToOne(type => Project, a => a.members, { onDelete: 'CASCADE' })
    project: Project;
}