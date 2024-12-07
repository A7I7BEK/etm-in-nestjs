import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskDeadlineChangeType } from '../enums/task-deadline-change-type.enum';

@Entity()
export class TaskDeadline
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task)
    task: Task;

    @Column({
        type: 'enum',
        enum: TaskDeadlineChangeType,
    })
    changeType: TaskDeadlineChangeType;

    @Column('json')
    changeDetails: Record<string, any>;

    @Column()
    commentReason: string;

    @Column()
    createdAt: Date;
}
