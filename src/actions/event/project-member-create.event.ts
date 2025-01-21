import { Employee } from 'src/employees/entities/employee.entity';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Project } from 'src/projects/entities/project.entity';

export interface ProjectMemberCreateEvent
{
    project: Project;

    employees: Employee[];

    activeUser: ActiveUserData;
}
