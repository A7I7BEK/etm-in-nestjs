import { EmployeesService } from 'src/employees/employees.service';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { In, Repository } from 'typeorm';
import { TaskCommentCreateDto } from '../dto/task-comment-create.dto';
import { TaskCommentUpdateDto } from '../dto/task-comment-update.dto';
import { TaskComment } from '../entities/task-comment.entity';


export async function createUpdateEntity
    (
        tasksService: TasksService,
        employeesService: EmployeesService,
        repository: Repository<TaskComment>,
        dto: TaskCommentCreateDto | TaskCommentUpdateDto,
        activeUser: ActiveUserData,
        entity = new TaskComment(),
    )
{
    if (dto instanceof TaskCommentCreateDto)
    {
        entity.task = await tasksService.findOne(
            {
                where: { id: dto.taskId }
            },
            activeUser,
        );
        entity.createdAt = new Date();
    }


    if (!activeUser.systemAdmin)
    {
        entity.author = await employeesService.findOne(
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


    const memberIds = dto.members.map(x => x.id);
    const memberEntities = await employeesService.findAll(
        {
            where: { id: In(memberIds) }
        },
        activeUser,
    );


    entity.commentText = dto.commentText;
    entity.commentType = dto.commentType;
    entity.members = memberEntities;
    entity.updatedAt = new Date();
    await repository.save(entity);


    wsEmitOneTask(
        tasksService,
        entity.task.id,
        activeUser,
        'replace',
    );


    return entity;
}
