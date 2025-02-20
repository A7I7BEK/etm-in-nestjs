import { Organization } from 'src/organizations/entities/organization.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ForgotPassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    uniqueId: string;

    @ManyToOne(type => User, { eager: true, onDelete: 'SET NULL' })
    user: User;

    @Column('json')
    userClone: User;

    @Column()
    createdAt: Date;

    @Column({ default: false })
    completed: boolean;

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}
