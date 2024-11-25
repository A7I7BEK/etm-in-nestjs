import { Project } from 'src/projects/entities/project.entity';
import { ProjectType } from 'src/projects/enums/project-type';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectColumn
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    codeName: string;

    @Column()
    ordering: number;

    @Column({
        type: 'enum',
        enum: ProjectType,
        default: ProjectType.TRELLO,
    })
    projectType: ProjectType;

    @ManyToOne(type => Project, p => p.columns)
    project: Project;
}
