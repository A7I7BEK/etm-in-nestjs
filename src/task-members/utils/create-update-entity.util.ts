import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { In, Repository } from 'typeorm';
import { TaskMemberCreateDto } from '../dto/task-member-create.dto';
import { TaskMemberUpdateDto } from '../dto/task-member-update.dto';
import { TaskMember } from '../entities/task-member.entity';


export async function createUpdateEntity
    (
        organizationsService: OrganizationsService,
        permissionsService: PermissionsService,
        repository: Repository<TaskMember>,
        dto: TaskMemberCreateDto | TaskMemberUpdateDto,
        activeUser: ActiveUserData,
        entity = new TaskMember(),
    )
{
    const organizationEntity = await organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    const permissionIds = dto.permissions.map(x => x.id); // temporary for this project, must be: [1, 2, 3]
    const permissionEntities = await permissionsService.findAll({ where: { id: In(permissionIds) } }); // BINGO


    entity.roleName = dto.roleName;
    entity.codeName = dto.codeName;
    entity.organization = organizationEntity;
    entity.permissions = permissionEntities;


    return repository.save(entity);
}
