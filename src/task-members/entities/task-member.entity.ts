import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskMember
{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Task, a => a.members, { onDelete: 'CASCADE' })
    task: Task;

    @ManyToOne(type => ProjectMember, { eager: true, onDelete: 'CASCADE' })
    projectMember: ProjectMember;
}
