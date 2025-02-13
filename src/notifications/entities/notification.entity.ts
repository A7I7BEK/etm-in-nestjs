import { Organization } from 'src/organizations/entities/organization.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roleName: string;

    @Column()
    codeName: string;

    @Column()
    systemCreated: boolean = false;

    @JoinTable()
    @ManyToMany(type => Permission, { eager: true })
    permissions: Permission[];

    @ManyToMany(type => User, user => user.roles)
    users: User[];

    @ManyToOne(type => Organization)
    organization: Organization;
}
