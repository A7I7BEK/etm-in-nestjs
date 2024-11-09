import { Employee } from 'src/employees/entities/employee.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectMember
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    isOnline: boolean = false;

    @Column()
    lastSeenTime: Date = new Date();

    @ManyToOne(type => Employee)
    employee: Employee;

    @Column()
    isTeamLeader: boolean;

    @ManyToOne(type => Project, p => p.members)
    project: Project;
}