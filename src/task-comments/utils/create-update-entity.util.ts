import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { In } from 'typeorm';
import { TaskCommentCreateDto } from '../dto/task-comment-create.dto';
import { TaskCommentUpdateDto } from '../dto/task-comment-update.dto';
import { TaskComment } from '../entities/task-comment.entity';
import { TaskCommentPermissions } from '../enums/task-comment-permissions.enum';
import { TaskCommentsService } from '../task-comments.service';


export async function createUpdateEntity
    (
        service: TaskCommentsService,
        dto: TaskCommentCreateDto | TaskCommentUpdateDto,
        activeUser: ActiveUserData,
        id = 0,
    )
{
    let entity = new TaskComment();
    let commentPerm: TaskCommentPermissions;


    if (dto instanceof TaskCommentCreateDto)
    {
        entity.task = await service.tasksService.findOne(
            {
                where: { id: dto.taskId },
                relations: {
                    project: true,
                }
            },
            activeUser,
        );
        entity.createdAt = new Date();
        commentPerm = TaskCommentPermissions.CREATE;
    }
    else
    {
        entity = await service.findOne(
            {
                where: { id },
                relations: {
                    task: {
                        project: true,
                    },
                }
            },
            activeUser,
        );
        commentPerm = TaskCommentPermissions.UPDATE;
    }


    if (!activeUser.systemAdmin)
    {
        entity.author = await service.employeesService.findOne(
            {
                where: {
                    user: {
                        id: activeUser.sub
                    }
                }
            },
            activeUser,
        );
    }


    if (dto.employeeIds.length)
    {
        entity.employees = await service.employeesService.findAll(
            {
                where: { id: In(dto.employeeIds) },
                relations: { user: true },
            },
            activeUser,
        );
    }


    entity.commentText = dto.commentText;
    entity.commentType = dto.commentType;
    entity.updatedAt = new Date();
    await service.repository.save(entity);


    wsEmitOneTask(
        service.tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    const actionData: BaseSimpleEvent<TaskComment> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, commentPerm ],
        actionData
    );


    return entity;
}
