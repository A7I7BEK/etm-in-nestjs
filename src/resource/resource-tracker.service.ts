import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/employees/entities/employee.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskAttachment } from 'src/task-attachments/entities/task-attachment.entity';
import { IsNull, Repository } from 'typeorm';
import { ResourceTracker } from './entities/resource-tracker.entity';
import { ResourceService } from './resource.service';


@Injectable()
export class ResourceTrackerService
{
    private readonly logger = new Logger(ResourceTrackerService.name);


    constructor (
        @InjectRepository(ResourceTracker)
        public readonly repository: Repository<ResourceTracker>,
        public readonly resourceService: ResourceService,
    ) { }


    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async cleanTemporaryFiles()
    {
        this.logger.log('Starting file cleanup...');

        const tempFiles = await this.repository.find({
            where: {
                employee: IsNull(), // BINGO: generic null doesn't work, use this instead
                taskAttachment: IsNull(),
                project: IsNull(),
            }
        });
        tempFiles.forEach(tracker => this.resourceService.removeSelf(tracker.resource));

        this.logger.log(`File cleanup completed. Quantity: ${tempFiles.length}`);
    }


    async setAll
        (
            entity: Employee | TaskAttachment | Project,
        )
    {
        if (entity instanceof Employee)
        {
            await this.setEmployee(entity);
        }
        else if (entity instanceof TaskAttachment)
        {
            await this.setTaskAttachment(entity);
        }
        else if (entity instanceof Project)
        {
            await this.setProject(entity);
        }
    }


    async setEmployee
        (
            employee: Employee,
        )
    {
        const entity = await this.repository.findOneBy({
            resource: {
                id: employee.photoFile.id,
            },
        });
        entity.employee = employee;
        await this.repository.save(entity);
    }


    async setTaskAttachment
        (
            taskAttachment: TaskAttachment,
        )
    {
        const entity = await this.repository.findOneBy({
            resource: {
                id: taskAttachment.file.id,
            },
        });
        entity.taskAttachment = taskAttachment;
        await this.repository.save(entity);
    }


    async setProject
        (
            project: Project,
        )
    {
        const entity = await this.repository.findOneBy({
            resource: {
                url: project.background,
            },
        });
        entity.project = project;
        await this.repository.save(entity);
    }
}
