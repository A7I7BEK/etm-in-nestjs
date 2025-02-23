import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { RoleCreateDto } from '../dto/role-create.dto';
import { RoleUpdateDto } from '../dto/role-update.dto';
import { Role } from '../entity/role.entity';
import { RolesService } from '../roles.service';


export async function createUpdateEntityPart
    (
        service: RolesService,
        dto: RoleCreateDto | RoleUpdateDto,
        activeUser: ActiveUserData,
        id = 0,
    )
{
    let entity = new Role();


    if (dto.constructor.name === RoleUpdateDto.name) // BINGO: best way to compare classes
    {
        entity = await service.findOne(
            {
                where: { id }
            },
            activeUser,
        );


        if (entity.systemCreated)
        {
            throw new ForbiddenException('System created Role cannot be edited');
        }
    }


    entity.organization = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    entity.permissions = await service.permissionsService.repository.find({
        where: { id: In(dto.permissionIds) } // BINGO: find multiple entities using In Operator
    });


    entity.name = dto.name;


    return service.repository.save(entity);
}
