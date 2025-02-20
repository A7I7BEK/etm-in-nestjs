import { ProjectMember } from 'src/project-members/entities/project-member.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

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

    @Column({ nullable: true })
    photoUrl: string;

    @JoinColumn()
    @OneToOne(type => User, a => a.employee, { onDelete: 'CASCADE' })
    user: Relation<User>;

    @OneToMany(type => ProjectMember, a => a.employee)
    members: ProjectMember[];
}
