import { Organization } from 'src/organizations/entities/organization.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleName: string;

    @Column({ unique: true })
    codeName: string;

    @JoinTable()
    @ManyToMany(type => Permission)
    permissions: Permission[];

    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @ManyToOne(type => Organization)
    organization: Organization;
}
