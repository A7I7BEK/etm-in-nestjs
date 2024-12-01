import { Project } from 'src/projects/entities/project.entity';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

    @OneToMany(type => Task, ts => ts.column)
    tasks: Task[];

    @ManyToOne(type => Project, p => p.columns)
    project: Project;
}
