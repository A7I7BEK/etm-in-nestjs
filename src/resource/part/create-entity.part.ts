import { InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Resource } from '../entities/resource.entity';
import { ResourceService } from '../resource.service';
import { calculateFileSize, generateFilePath } from '../utils/resource.utils';


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
        await fs.promises.writeFile(filePath, file.buffer);

        return service.repository.save(entity);
    }
    catch (error)
    {
        throw new InternalServerErrorException('Failed to save file');
    }
}
