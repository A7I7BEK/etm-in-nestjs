import { NotAcceptableException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { GroupCreateDto } from '../dto/group-create.dto';
import { GroupUpdateDto } from '../dto/group-update.dto';
import { Group } from '../entities/group.entity';
import { GroupsService } from '../groups.service';


export async function createUpdateEntityPart
    (
        service: GroupsService,
        dto: GroupCreateDto | GroupUpdateDto,
        activeUser: ActiveUserData,
        id = 0,
    )
{
    if (!dto.employeeIds.includes(dto.leaderId))
    {
        throw new NotAcceptableException('Leader must be an employee of the group');
    }


    let entity = new Group();


    if (dto.constructor.name === GroupUpdateDto.name)
    {
        entity = await service.findOne(
            {
                where: { id }
            },
            activeUser,
        );
    }


    entity.organization = await service.organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    entity.employees = await service.employeesService.findAll(
        {
            where: { id: In(dto.employeeIds) }
        },
        activeUser,
    );


    entity.leader = await service.employeesService.findOne(
        {
            where: { id: dto.leaderId }
        },
        activeUser,
    );


    entity.name = dto.name;


    return service.repository.save(entity);
}
