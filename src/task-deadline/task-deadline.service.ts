import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskDeadlineAllDto } from './dto/task-deadline-all.dto';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadline } from './entities/task-deadline.entity';
import { TaskDeadlineAction } from './enums/task-deadline-action.enum';
import { createUpdateDeleteEntity } from './utils/create-update-delete-entity.util';

@Injectable()
export class TaskDeadlineService
{
    constructor (
        @InjectRepository(TaskDeadline)
        public readonly repository: Repository<TaskDeadline>,
        public readonly tasksService: TasksService,
    ) { }


    async create
        (
            createDto: TaskDeadlineCreateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();
        entity.action = TaskDeadlineAction.Create;
        entity.details = createDto;
        entity.comment = TaskDeadlineAction.Create;
        entity.createdAt = new Date();

        const dto = new TaskDeadlineAllDto();
        dto.taskId = createDto.taskId;
        dto.startDate = new Date(createDto.startDate);
        dto.endDate = new Date(createDto.deadLine);

        return createUpdateDeleteEntity(this, entity, dto, activeUser);
    }


    async update
        (
            updateDto: TaskDeadlineUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();
        entity.action = TaskDeadlineAction.Update;
        entity.details = updateDto;
        entity.comment = updateDto.changesComment;
        entity.createdAt = new Date();

        const dto = new TaskDeadlineAllDto();
        dto.taskId = updateDto.taskId;
        dto.startDate = new Date(updateDto.startDate);
        dto.endDate = new Date(updateDto.deadLine);

        return createUpdateDeleteEntity(this, entity, dto, activeUser);
    }


    async remove
        (
            deleteDto: TaskDeadlineDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = new TaskDeadline();
        entity.action = TaskDeadlineAction.Delete;
        entity.details = deleteDto;
        entity.comment = deleteDto.changesComment;
        entity.createdAt = new Date();

        const dto = new TaskDeadlineAllDto();
        dto.taskId = deleteDto.taskId;
        if (deleteDto.startDate)
        {
            dto.startDate = null;
        }
        if (deleteDto.deadLine)
        {
            dto.endDate = null;
        }

        return createUpdateDeleteEntity(this, entity, dto, activeUser);
    }
}
