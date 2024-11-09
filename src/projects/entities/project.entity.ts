import { Employee } from 'src/employees/entities/employee.entity';
import { Group } from 'src/groups/entities/group.entity';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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

    @ManyToOne(type => Employee)
    manager: Employee;

    @ManyToOne(type => Organization)
    organization: Organization;
}
