import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResourceTracker } from '../entities/resource-tracker.entity';
import { Resource } from '../entities/resource.entity';
import { ResourceService } from '../resource.service';
import { calculateFileSize, generateFilePath, generateFullPath } from '../utils/resource.utils';


export async function createEntityPart
    (
        service: ResourceService,
        file: Express.Multer.File,
        activeUser: ActiveUserData,
    )
{
    const organizationEntity = await service.organizationsService.findOne({
        where: { id: activeUser.orgId }
    });


    const { filePath, filename } = generateFilePath(file);


    const entity = new Resource();
    entity.url = filePath;
    entity.name = filename;
    entity.filename = filename;
    entity.mimetype = file.mimetype;
    entity.size = file.buffer.length; // BINGO: get file size in bytes
    entity.sizeCalculated = calculateFileSize(file.buffer.length);
    entity.createdAt = new Date();
    entity.updatedAt = new Date();
    entity.organization = organizationEntity;


    try
    {
        const fullPath = generateFullPath(filePath);

        await fs.promises.mkdir(
            path.posix.dirname(fullPath),
            { recursive: true },
        );

        await fs.promises.writeFile(
            fullPath,
            file.buffer,
        );

        await service.resRepo.save(entity);


        const tracker = new ResourceTracker();
        tracker.resource = entity;
        await service.trackerRepo.save(tracker);


        return entity;
    }
    catch (error)
    {
        console.log('Failed to save file: ', error);

        throw new InternalServerErrorException('Failed to save file');
    }
}
