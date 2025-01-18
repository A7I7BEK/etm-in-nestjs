import { Employee } from 'src/employees/entities/employee.entity';
import { PERMISSION_VALUES, PermissionType } from 'src/iam/authorization/permission.constants';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Action
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: Date;

    @Column({
        type: 'enum',
        enum: PERMISSION_VALUES,
    })
    activityType: PermissionType;

    @Column('json')
    details: Record<string, any>;

    @ManyToOne(type => Employee)
    employee: Employee;

    @ManyToOne(type => Project, p => p.actions)
    project: Project;

    @ManyToOne(type => Task, t => t.actions)
    task: Task;
}
