import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskDeadlineAction } from '../enums/task-deadline-action.enum';

@Entity()
export class TaskDeadline
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task)
    task: Task;

    @Column({
        type: 'enum',
        enum: TaskDeadlineAction,
    })
    action: TaskDeadlineAction;

    @Column('json')
    details: Record<string, any>;

    @Column()
    comment: string;

    @Column()
    createdAt: Date;
}
