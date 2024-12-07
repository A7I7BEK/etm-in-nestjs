import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { TasksService } from 'src/tasks/tasks.service';
import { Repository } from 'typeorm';
import { TaskDeadlineCreateDto } from './dto/task-deadline-create.dto';
import { TaskDeadlineDeleteDto } from './dto/task-deadline-delete.dto';
import { TaskDeadlineUpdateDto } from './dto/task-deadline-update.dto';
import { TaskDeadline } from './entities/task-deadline.entity';

@Injectable()
export class TaskDeadlineService
{
    constructor (
        @InjectRepository(TaskDeadline)
        public readonly repository: Repository<TaskDeadline>,
        private readonly _tasksService: TasksService,
    ) { }


    create
        (
            createDto: TaskDeadlineCreateDto,
            activeUser: ActiveUserData,
        )
    {

    }


    async update
        (
            updateDto: TaskDeadlineUpdateDto,
            activeUser: ActiveUserData,
        )
    {

    }


    async remove
        (
            deleteDto: TaskDeadlineDeleteDto,
            activeUser: ActiveUserData,
        )
    {

    }
}
