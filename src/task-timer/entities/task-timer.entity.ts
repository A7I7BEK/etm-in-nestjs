import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskTimerStatus } from '../enums/task-timer-status.enum';

@Entity()
export class TaskTimer
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: TaskTimerStatus,
    })
    status: TaskTimerStatus;

    @Column()
    time: Date;

    @ManyToOne(type => Task, { onDelete: 'CASCADE' })
    task: Task;

    @ManyToOne(type => Employee, { onDelete: 'SET NULL' })
    employee: Employee;
}
