import { PermissionType } from 'src/iam/authorization/permission.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    codeName: PermissionType;
}
