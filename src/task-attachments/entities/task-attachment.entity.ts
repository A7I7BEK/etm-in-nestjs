import { Resource } from 'src/resource/entities/resource.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class TaskAttachment extends Resource // TODO: check experimental
{
    @ManyToOne(type => Task, t => t.attachments)
    task: Task;
}
