import { CheckListGroup } from 'src/check-list-groups/entities/check-list-group.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckListItem
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    checked: boolean = false;

    @JoinTable()
    @ManyToMany(type => Employee)
    members: Employee[];

    @ManyToOne(type => CheckListGroup, c => c.checkList, { onDelete: 'CASCADE' })
    checkListGroup: CheckListGroup;

    @ManyToOne(type => Task)
    task: Task;
}
