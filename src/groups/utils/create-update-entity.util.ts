import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { In, Repository } from 'typeorm';
import { GroupCreateDto } from '../dto/group-create.dto';
import { GroupUpdateDto } from '../dto/group-update.dto';
import { Group } from '../entities/group.entity';


export async function createUpdateEntity
    (
        organizationsService: OrganizationsService,
        employeesService: EmployeesService,
        repository: Repository<Group>,
        dto: GroupCreateDto | GroupUpdateDto,
        activeUser: ActiveUserData,
        entity = new Group(),
    )
{
    const organizationEntity = await organizationsService.findOneActiveUser(
        {
            where: { id: dto.organizationId }
        },
        activeUser,
    );


    const employeeEntities = await employeesService.findAll(
        {
            where: { id: In(dto.employeeIds) }
        },
        activeUser,
    );


    const leaderEmployee = await employeesService.findOne(
        {
            where: { id: dto.leaderId }
        },
        activeUser,
    );


    entity.name = dto.name;
    entity.employees = employeeEntities;
    entity.leader = leaderEmployee;
    entity.organization = organizationEntity;


    return repository.save(entity);
}
