import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskMemberCreateDto } from '../dto/task-member-create.dto';
import { TaskMember } from '../entities/task-member.entity';


export async function createUpdateEntity
    (
        tasksService: TasksService,
        employeesService: EmployeesService,
        repository: Repository<TaskMember>,
        dto: TaskMemberCreateDto,
        activeUser: ActiveUserData,
        entity = new TaskMember(),
    )
{
    entity.task = await tasksService.findOne(
        {
            where: { id: dto.taskId }
        },
        activeUser,
    );


    entity.employee = await employeesService.findOne(
        {
            where: { id: dto.employeeId }
        },
        activeUser,
    );


    return repository.save(entity);
}
