import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { In, Repository } from 'typeorm';
import { ProjectMemberCreateDto } from '../dto/project-member-create.dto';
import { ProjectMember } from '../entities/project-member.entity';


export async function createUpdateEntity(
    projectsService: ProjectsService,
    employeesService: EmployeesService,
    repository: Repository<ProjectMember>,
    dto: ProjectMemberCreateDto,
    activeUser: ActiveUserData,
)
{
    const projectEntity = await projectsService.findOne(
        {
            where: { id: dto.projectId }
        },
        activeUser,
    );

    const employeeIds = dto.userIds.map(x => x.id); // temporary for this project, must be: [1, 2, 3]
    const employeeEntities = await employeesService.findAll(
        {
            where: { id: In(employeeIds) }
        },
        activeUser,
    );

    const entityList = employeeEntities.map(empl =>
    {
        const entity = new ProjectMember();
        entity.project = projectEntity;
        entity.employee = empl;

        return entity;
    });

    return repository.save(entityList);
}
