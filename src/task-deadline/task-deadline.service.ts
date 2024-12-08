import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadline } from './entities/task-deadline.entity';
import { TaskDeadlineAction } from './enums/task-deadline-action.enum';

@Injectable()
export class TaskDeadlineService
{
    constructor (
        @InjectRepository(TaskDeadline)
        public readonly repository: Repository<TaskDeadline>,
        private readonly _tasksService: TasksService,
    ) { }


    async create
        (
            createDto: TaskDeadlineCreateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();

        entity.task = await this._tasksService.findOne(
            {
                where: {
                    id: createDto.taskId
                }
            },
            activeUser
        );

        entity.action = TaskDeadlineAction.Create;
        entity.details = createDto;
        entity.comment = TaskDeadlineAction.Create;
        entity.createdAt = new Date();
        await this.repository.save(entity);

        entity.task.startDate = new Date(createDto.startDate);
        entity.task.endDate = new Date(createDto.deadLine);
        return this._tasksService.repository.save(entity.task);
    }


    async update
        (
            updateDto: TaskDeadlineUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();

        entity.task = await this._tasksService.findOne(
            {
                where: {
                    id: updateDto.taskId
                }
            },
            activeUser
        );

        entity.action = TaskDeadlineAction.Update;
        entity.details = updateDto;
        entity.comment = updateDto.changesComment;
        entity.createdAt = new Date();
        await this.repository.save(entity);

        entity.task.startDate = new Date(updateDto.startDate);
        entity.task.endDate = new Date(updateDto.deadLine);
        return this._tasksService.repository.save(entity.task);
    }


    async remove
        (
            deleteDto: TaskDeadlineDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();

        entity.task = await this._tasksService.findOne(
            {
                where: {
                    id: deleteDto.taskId
                }
            },
            activeUser
        );

        entity.action = TaskDeadlineAction.Delete;
        entity.details = deleteDto;
        entity.comment = deleteDto.changesComment;
        entity.createdAt = new Date();
        await this.repository.save(entity);

        if (deleteDto.startDate)
        {
            entity.task.startDate = null;
        }

        if (deleteDto.deadLine)
        {
            entity.task.endDate = null;
        }

        return this._tasksService.repository.save(entity.task);
    }
}
