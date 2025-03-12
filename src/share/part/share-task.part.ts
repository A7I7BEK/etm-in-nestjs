import { NotFoundException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { In } from 'typeorm';
import { ShareTaskDto } from '../dto/share-task.dto';
import { ShareChannel } from '../enum/share-channel.enum';
import { ShareService } from '../share.service';


export async function shareTaskPart
    (
        service: ShareService,
        dto: ShareTaskDto,
        activeUser: ActiveUserData,
        shareChannel: ShareChannel,
    )
{
    const taskEntity = await service.tasksService.findOne(
        {
            where: {
                id: dto.taskId
            }
        },
        activeUser,
    );


    const employeeEntities = await service.employeesService.findAll(
        {
            where: {
                id: In(dto.employeeIds)
            },
            relations: {
                user: true
            },
        },
        activeUser,
    );
    if (employeeEntities.length === 0)
    {
        throw new NotFoundException('Employees not found');
    }


    const activeEmployee = await service.employeesService.findOne(
        {
            where: {
                user: {
                    id: activeUser.sub
                },
            },
            relations: {
                user: true
            },
        },
        activeUser,
    );


    if (shareChannel === ShareChannel.EMAIL)
    {
        await service.mailService.shareTask(
            activeEmployee,
            taskEntity,
            employeeEntities,
        );
    }
    else if (shareChannel === ShareChannel.TELEGRAM)
    {
        // TODO: Telegram needs to be implemented
    }
}
