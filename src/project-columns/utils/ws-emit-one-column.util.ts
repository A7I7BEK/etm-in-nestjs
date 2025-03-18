import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { modifyTaskForBoard } from 'src/tasks/utils/modify-task-for-board.util';
import { FindOptionsRelations } from 'typeorm';
import { ProjectColumn } from '../entities/project-column.entity';
import { ProjectColumnsService } from '../project-columns.service';


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


    entity.tasks?.forEach(task =>
    {
        modifyTaskForBoard(task);
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
