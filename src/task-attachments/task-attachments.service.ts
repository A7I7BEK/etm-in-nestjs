import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceService } from 'src/resource/resource.service';
import { TasksService } from 'src/tasks/tasks.service';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { TaskAttachmentCreateDto } from './dto/task-attachment-create.dto';
import { TaskAttachment } from './entities/task-attachment.entity';

@Injectable()
export class TaskAttachmentsService
{
    constructor (
        @InjectRepository(TaskAttachment)
        public readonly repository: Repository<TaskAttachment>,
        private readonly _tasksService: TasksService,
        private readonly _resourceService: ResourceService,
    ) { }


    async create
        (
            createDto: TaskAttachmentCreateDto,
            activeUser: ActiveUserData,
        )
    {
        const taskEntity = await this._tasksService.findOne(
            {
                where: { id: createDto.taskId }
            },
            activeUser,
        );

        const resourceIds = createDto.attachments.map(x => x.id);
        const resourceEntities = await this._resourceService.findAll(
            {
                where: { id: In(resourceIds) },
            },
            activeUser,
        );

        const entityList = resourceEntities.map(item =>
        {
            const entity = new TaskAttachment();
            Object.assign(entity, item);
            entity.task = taskEntity;

            return entity;
        });

        return this.repository.save(entityList);
    }


    findAll
        (
            options: FindManyOptions<TaskAttachment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<TaskAttachment> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findOne
        (
            options: FindOneOptions<TaskAttachment>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<TaskAttachment> = {
                where: {
                    task: {
                        project: {
                            organization: {
                                id: activeUser.orgId
                            }
                        }
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${TaskAttachment.name} not found`);
        }

        return entity;
    }


    async remove
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );
        return this.repository.remove(entity);
    }
}
