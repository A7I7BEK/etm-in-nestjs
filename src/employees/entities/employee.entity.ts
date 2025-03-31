import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { Resource } from 'src/resource/entities/resource.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

@Entity()
export class Employee
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    middleName: string;

    @Column({ nullable: true })
    birthDate: Date;

    @ManyToOne(type => Resource, { eager: true, onDelete: 'SET NULL' })
    photoFile: Resource;

    @JoinColumn()
    @OneToOne(type => User, a => a.employee, { onDelete: 'CASCADE' })
    user: Relation<User>;

    @OneToMany(type => ProjectMember, a => a.employee)
    members: ProjectMember[];
}
