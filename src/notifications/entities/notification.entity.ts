import { Action } from 'src/actions/entities/action.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NotificationType } from '../enums/notification-type.enum';

@Entity()
export class Notification
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({ nullable: true })
    seenAt: Date;

    @ManyToOne(type => Action)
    action: Action;

    @ManyToOne(type => User)
    user: User;
}
