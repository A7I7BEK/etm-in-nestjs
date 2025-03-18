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

    @Column({ type: 'boolean', default: false })
    checked: boolean;

    @JoinTable()
    @ManyToMany(type => Employee)
    employees: Employee[];

    @ManyToOne(type => CheckListGroup, a => a.checkList, { onDelete: 'CASCADE' }) // BINGO: delete the record when parent is deleted
    checkListGroup: CheckListGroup;

    @ManyToOne(type => Task, { onDelete: 'SET NULL' })
    task: Task;
}
