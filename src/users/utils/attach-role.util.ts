import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { UserAttachRoleDto } from '../dto/user-attach-role.dto';
import { UsersService } from '../users.service';


export async function attachRoleUtil
    (
        service: UsersService,
        dto: UserAttachRoleDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: dto.userId }
        },
        activeUser,
    );


    if (entity.marks.registered)
    {
        throw new ForbiddenException('Role of ADMIN user cannot be changed');
    }


    entity.roles = await service.rolesService.findAll(
        {
            where: { id: In(dto.roleIds) }
        },
        activeUser,
    );


    return service.repository.save(entity);
}
