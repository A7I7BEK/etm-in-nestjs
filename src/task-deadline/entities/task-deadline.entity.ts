import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskDeadlinePermissions } from '../enums/task-deadline-permissions.enum';

@Entity()
export class TaskDeadline
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task, { onDelete: 'CASCADE' })
    task: Task;

    @Column({
        type: 'enum',
        enum: TaskDeadlinePermissions,
    })
    action: TaskDeadlinePermissions;

    @Column('json')
    details: Record<string, any>;

    @Column()
    comment: string;

    @Column()
    createdAt: Date;
}
