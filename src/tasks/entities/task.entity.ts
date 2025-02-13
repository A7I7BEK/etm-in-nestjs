import { Action } from 'src/actions/entities/action.entity';
import { CheckListGroup } from 'src/check-list-groups/entities/check-list-group.entity';
import { ProjectColumn } from 'src/project-columns/entities/project-column.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskAttachment } from 'src/task-attachments/entities/task-attachment.entity';
import { TaskComment } from 'src/task-comments/entities/task-comment.entity';
import { TaskMember } from 'src/task-members/entities/task-member.entity';
import { TaskTag } from 'src/task-tags/entities/task-tag.entity';
import { TaskTimerStatus } from 'src/task-timer/enums/task-timer-status.enum';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';

@Entity()
export class Task
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    ordering: number;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    startDate: Date;

    @Column({ nullable: true })
    endDate: Date;

    @Column({
        type: 'enum',
        enum: TaskLevel,
        nullable: true,
    })
    level: TaskLevel;

    @Column({
        type: 'enum',
        enum: TaskPriority,
        nullable: true,
    })
    priority: TaskPriority;

    @Column({
        type: 'enum',
        enum: TaskTimerStatus,
        default: TaskTimerStatus.STOP,
    })
    timeEntryType: TaskTimerStatus;

    @Column({ type: 'integer', default: 0 })
    totalTimeSpent: number;

    @ManyToOne(type => ProjectColumn, c => c.tasks)
    column: ProjectColumn;

    @ManyToOne(type => Project, p => p.tasks)
    project: Project;

    @OneToMany(type => TaskMember, m => m.task)
    members: TaskMember[];

    @OneToMany(type => TaskTag, t => t.task)
    tags: TaskTag[];

    @OneToMany(type => TaskComment, c => c.task)
    comments: TaskComment[];

    @OneToMany(type => TaskAttachment, a => a.task)
    attachments: TaskAttachment[];

    @OneToMany(type => CheckListGroup, c => c.task)
    checkListGroups: CheckListGroup[];

    @OneToMany(type => Action, a => a.task)
    actions: Action[];
}
