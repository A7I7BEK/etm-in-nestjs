import { Employee } from 'src/employees/entities/employee.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectType } from '../enums/project-type';

@Entity()
export class Project
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    codeName: string;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.TRELLO,
    })
    projectType: ProjectType;

    @ManyToOne(type => Group)
    group: Group;

    @OneToMany(type => ProjectMember, pMember => pMember.project)
    members: ProjectMember[];

    @ManyToOne(type => Employee)
    manager: Employee;

    @ManyToOne(type => Organization)
    organization: Organization;
}
