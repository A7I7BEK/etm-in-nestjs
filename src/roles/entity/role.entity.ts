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
    name: string;

    @Column()
    systemCreated: boolean = false;

    @JoinTable()
    @ManyToMany(type => Permission, { eager: true })
    permissions: Permission[];

    @ManyToMany(type => User, a => a.roles)
    users: User[];

    @ManyToOne(type => Organization, { onDelete: 'CASCADE' })
    organization: Organization;
}
