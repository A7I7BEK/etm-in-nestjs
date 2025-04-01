import { Employee } from 'src/employees/entities/employee.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskAttachment } from 'src/task-attachments/entities/task-attachment.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';


@Entity()
export class ResourceTracker
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Resource, { eager: true, onDelete: 'CASCADE' })
    resource: Resource;

    @ManyToOne(type => Employee, { onDelete: 'SET NULL' })
    employee: Employee;

    @ManyToOne(type => TaskAttachment, { onDelete: 'SET NULL' })
    taskAttachment: TaskAttachment;

    @ManyToOne(type => Project, { onDelete: 'SET NULL' })
    project: Project;
}