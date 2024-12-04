import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskMember
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Employee, { eager: true })
    employee: Employee;

    @ManyToOne(type => Task, t => t.members)
    task: Task;
}
