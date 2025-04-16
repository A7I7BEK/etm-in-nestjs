import { ConflictException } from '@nestjs/common';
import { Action } from 'src/actions/entities/action.entity';
import { BaseSimpleEvent } from 'src/actions/event/base-simple.event';
import { Employee } from 'src/employees/entities/employee.entity';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Task } from 'src/tasks/entities/task.entity';
import { wsEmitOneTask } from 'src/tasks/utils/ws-emit-one-task.util';
import { TaskTimer } from '../entities/task-timer.entity';
import { TaskTimerPermissions } from '../enums/task-timer-permissions.enum';
import { TaskTimerStatus } from '../enums/task-timer-status.enum';
import { TaskTimerService } from '../task-timer.service';


export async function stopEntity
    (
        service: TaskTimerService,
        taskEntity: Task,
        employeeEntity: Employee,
        activeUser: ActiveUserData,
    )
{
    if (taskEntity.timerStatus === TaskTimerStatus.STOP)
    {
        throw new ConflictException(`${TaskTimer.name} already stopped`);
    }


    const taskTimerEntity = await service.findOne(
        {
            where: {
                task: {
                    id: taskEntity.id
                },
                status: TaskTimerStatus.START
            },
            order: {
                id: 'DESC'
            }
        },
        activeUser,
    );


    const currentTime = new Date();
    const timeSpent = Math.floor(
        (currentTime.getTime() - taskTimerEntity.time.getTime()) / 1000,
    );


    taskEntity.totalTimeSpent += timeSpent;
    taskEntity.timerStatus = TaskTimerStatus.STOP;
    await service.tasksService.repository.save(taskEntity);


    const entity = new TaskTimer();
    entity.status = TaskTimerStatus.STOP;
    entity.time = currentTime;
    entity.task = taskEntity;
    entity.employee = employeeEntity;
    await service.repository.save(entity);


    wsEmitOneTask(service.tasksService, taskEntity.id, activeUser, 'replace');


    const actionData: BaseSimpleEvent<TaskTimer> = {
        entity: structuredClone(entity),
        activeUser,
    };
    service.eventEmitter.emit(
        [ Action.name, TaskTimerPermissions.STOP ],
        actionData
    );


    return entity;
}
