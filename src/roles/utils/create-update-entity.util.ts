import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Organization } from 'src/organizations/entities/organization.entity';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../entities/role.entity';


export async function createUpdateEntity(
    organizationsService: OrganizationsService,
    permissionsService: PermissionsService,
    repository: Repository<Role>,
    dto: CreateRoleDto | UpdateRoleDto,
    activeUser: ActiveUserData,
    entity = new Role(),
)
{
    let organizationEntity: Organization;
    if (!activeUser.systemAdmin)
    {
        organizationEntity = await organizationsService.findOne({ id: activeUser.orgId });
    }
    else
    {
        organizationEntity = await organizationsService.findOne({ id: dto.organizationId });
    }

    const permissionIds = dto.permissions.map(x => x.id); // temporary for this project, must be: [1, 2, 3]
    const permissionEntities = await permissionsService.findAll({ where: { id: In(permissionIds) } }); // BINGO

    entity.roleName = dto.roleName;
    entity.codeName = dto.codeName;
    entity.organization = organizationEntity;
    entity.permissions = permissionEntities;

    return repository.save(entity);
}
