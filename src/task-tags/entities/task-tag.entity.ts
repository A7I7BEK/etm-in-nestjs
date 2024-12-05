import { ProjectTag } from 'src/project-tags/entities/project-tag.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskTag
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task, t => t.tags)
    task: Task;

    @ManyToOne(type => ProjectTag, { eager: true })
    projectTag: ProjectTag;
}
