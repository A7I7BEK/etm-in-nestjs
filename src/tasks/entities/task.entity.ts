import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';

@Entity()
export class Task
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    ordering: number;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({
        type: 'enum',
        enum: TaskLevel,
        nullable: true,
    })
    level: TaskLevel;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        nullable: true,
    })
    priority: TaskPriority;

    @ManyToOne(type => ProjectColumn, c => c.tasks)
    column: ProjectColumn;

    @ManyToOne(type => Project, p => p.tasks)
    project: Project;
}
