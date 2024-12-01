import { Employee } from 'src/employees/entities/employee.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectType } from '../enums/project-type.enum';

@Entity()
export class Project
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    codeName: string;

    @Column({ nullable: true })
    background: string;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.TRELLO,
    })
    projectType: ProjectType;

    @ManyToOne(type => Group)
    group: Group;

    @OneToMany(type => ProjectMember, m => m.project)
    members: ProjectMember[];

    @ManyToOne(type => Employee)
    manager: Employee;

    @OneToMany(type => ProjectColumn, c => c.project)
    columns: ProjectColumn[];

    @OneToMany(type => ProjectTag, t => t.project)
    tags: ProjectTag[];

    @ManyToOne(type => Organization)
    organization: Organization;
}
