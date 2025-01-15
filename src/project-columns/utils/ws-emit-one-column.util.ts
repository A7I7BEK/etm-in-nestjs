import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { modifyTaskForProject } from 'src/tasks/utils/modify-task-for-project.util';
import { FindOptionsRelations } from 'typeorm';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnsService } from '../project-columns.service';
import { modifyProjectColumnForFront } from './modify-entity-for-front.util';


export async function wsEmitOneColumn
    (
        service: ProjectColumnsService,
        id: number,
        activeUser: ActiveUserData,
        action: 'insert' | 'replace' | 'send',
    )
{
    const sendRelations: FindOptionsRelations<ProjectColumn> = {
        project: true,
        tasks: {
            checkListGroups: {
                checkList: true
            },
            comments: true,
            members: {
                projectMember: {
                    employee: {
                        user: true
                    }
                }
            },
            tags: {
                projectTag: true
            }
        }
    };


    const entity = await service.findOne(
        {
            where: { id },
            relations: action === 'send' ? sendRelations : { project: true },
        },
        activeUser,
    );


    modifyProjectColumnForFront(entity);
    entity.tasks?.forEach(task =>
    {
        modifyTaskForProject(task);
    });


    if (action === 'insert')
    {
        entity.tasks = [];
        service.columnsGateway.emitInsert(entity, entity.project.id);
    }
    else if (action === 'replace')
    {
        service.columnsGateway.emitReplace(entity, entity.project.id);
    }
    else if (action === 'send')
    {
        service.columnsGateway.emitInsert(entity, entity.project.id);
    }
}
