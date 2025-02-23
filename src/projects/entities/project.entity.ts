import { Action } from 'src/actions/entities/action.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectType } from '../enums/project-type.enum';

@Entity()
export class Project
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    background: string;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.TRELLO,
    })
    projectType: ProjectType;

    @ManyToOne(type => Group, a => a.projects, { onDelete: 'SET NULL' })
    group: Group;

    @OneToMany(type => ProjectMember, a => a.project)
    members: ProjectMember[];

    @ManyToOne(type => Employee, { onDelete: 'SET NULL' })
    manager: Employee;

    @OneToMany(type => ProjectColumn, a => a.project)
    columns: ProjectColumn[];

    @OneToMany(type => Task, a => a.project)
    tasks: Task[];

    @OneToMany(type => ProjectTag, a => a.project)
    tags: ProjectTag[];

    @OneToMany(type => Action, a => a.project)
    actions: Action[];

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}
