import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';
import { TaskStatus } from '../enums/task-status.enum';

@Entity()
export class Task
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    createdAt: Date;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({
        type: 'enum',
        enum: TaskStatus,
        nullable: true,
    })
    taskStatus: TaskStatus;

    @Column({
        type: 'enum',
        enum: TaskLevel,
        nullable: true,
    })
    taskLevel: TaskLevel;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        nullable: true,
    })
    taskPriority: TaskPriority;

    @ManyToOne(type => ProjectColumn, c => c.tasks)
    column: ProjectColumn;

    @ManyToOne(type => Project, p => p.tasks)
    project: Project;
}
