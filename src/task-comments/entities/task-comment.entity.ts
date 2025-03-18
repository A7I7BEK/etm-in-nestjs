import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskCommentType } from '../enums/task-comment-type.enum';

@Entity()
export class TaskComment
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Employee, { eager: true, onDelete: 'SET NULL' })
    author: Employee;

    @Column()
    commentText: string;

    @Column({
        type: 'enum',
        enum: TaskCommentType,
    })
    commentType: TaskCommentType;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @JoinTable()
    @ManyToMany(type => Employee)
    employees: Employee[];

    @ManyToOne(type => Task, a => a.comments, { onDelete: 'CASCADE' })
    task: Task;
}
