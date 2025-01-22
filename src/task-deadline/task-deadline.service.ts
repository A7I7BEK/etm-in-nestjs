import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadline } from './entities/task-deadline.entity';
import { createUpdateDeleteEntity } from './utils/create-update-delete-entity.util';

@Injectable()
export class TaskDeadlineService
{
    constructor (
        @InjectRepository(TaskDeadline)
        public readonly repository: Repository<TaskDeadline>,
        public readonly tasksService: TasksService,
        public readonly eventEmitter: EventEmitter2,
    ) { }


    create
        (
            createDto: TaskDeadlineCreateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateDeleteEntity(this, createDto, activeUser);
    }


    update
        (
            updateDto: TaskDeadlineUpdateDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateDeleteEntity(this, updateDto, activeUser);
    }


    remove
        (
            deleteDto: TaskDeadlineDeleteDto,
            activeUser: ActiveUserData,
        )
    {
        return createUpdateDeleteEntity(this, deleteDto, activeUser);
    }
}
