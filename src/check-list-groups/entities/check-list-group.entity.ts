import { CheckListItem } from 'src/check-list-items/entities/check-list-item.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckListGroup
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => CheckListItem, a => a.checkListGroup)
    checkList: CheckListItem[];

    @ManyToOne(type => Task, a => a.checkListGroups, { onDelete: 'CASCADE' })
    task: Task;
}
