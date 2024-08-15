import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OneTimePasswordParent } from './one-time-password-parent.entity';

@Entity()
export class OneTimePassword
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    expireTime: string;

    @Column({ default: false })
    used: boolean;

    @ManyToOne(type => OneTimePasswordParent, parent => parent.children)
    parent: OneTimePasswordParent;
}
