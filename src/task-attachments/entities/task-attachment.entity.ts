import { Resource } from 'src/resource/entities/resource.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskAttachment
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Resource, { eager: true, onDelete: 'CASCADE' })
    file: Resource;

    @ManyToOne(type => Task, a => a.attachments, { onDelete: 'CASCADE' })
    task: Task;
}
