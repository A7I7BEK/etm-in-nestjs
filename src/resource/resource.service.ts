import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { ResourceStatus } from './enums/resource-status.enum';
import { createEntityPart } from './part/create-entity.part';
import { deleteEntityByIdPart } from './part/delete-entity-by-id.part';
import { deleteEntityByUrlSilentPart } from './part/delete-entity-by-url-silent.part';
import { deleteEntityByUrlPart } from './part/delete-entity-by-url.part';
import { deleteEntitySelfPart } from './part/delete-entity-self.part';
import { resizeImagePart } from './part/resize-image.part';
import { savePermanentByIdPart } from './part/save-permanent-by-id.part';
import { savePermanentByUrlPart } from './part/save-permanent-by-url.part';
import { updateEntityPart } from './part/update-entity.part';
import { MIME_TYPE_IMAGES } from './utils/resource.constants';


@Injectable()
export class ResourceService
{
    private readonly logger = new Logger(ResourceService.name);


    constructor (
        @InjectRepository(Resource)
        public readonly repository: Repository<Resource>,
        public readonly organizationsService: OrganizationsService,
    ) { }


    async uploadFile
        (
            file: Express.Multer.File,
            minDimensionDto: MinDimensionDto,
            activeUser: ActiveUserData,
        )
    {
        const { minWidth: width, minHeight: height } = minDimensionDto;

        if (MIME_TYPE_IMAGES.includes(file.mimetype) && width && height)
        {
            const resizedImage = await resizeImagePart(file, width, height);
            return this.uploadSimple(resizedImage, activeUser);
        }
        else
        {
            return this.uploadSimple(file, activeUser);
        }
    }


    uploadSimple // BINGO: simplified upload function for later use
        (
            file: Express.Multer.File,
            activeUser: ActiveUserData,
        )
    {
        return createEntityPart(this, file, activeUser);
    }


    uploadMultipleFiles
        (
            files: Express.Multer.File[],
            activeUser: ActiveUserData,
        )
    {
        return Promise.all(files.map(file => this.uploadSimple(file, activeUser))); // BINGO: simplified upload function usage
    }


    findAll
        (
            options: FindManyOptions<Resource>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindManyOptions<Resource> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        return this.repository.find(options);
    }


    async findOne
        (
            options: FindOneOptions<Resource>,
            activeUser: ActiveUserData,
        )
    {
        if (!activeUser.systemAdmin)
        {
            const orgOption: FindOneOptions<Resource> = {
                where: {
                    organization: {
                        id: activeUser.orgId
                    }
                }
            };

            setNestedOptions(options ??= {}, orgOption);
        }

        const entity = await this.repository.findOne(options);
        if (!entity)
        {
            throw new NotFoundException(`${Resource.name} not found`);
        }

        return entity;
    }


    savePermanentById
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return savePermanentByIdPart(this, id, activeUser);
    }


    savePermanentByUrl
        (
            url: string,
            activeUser: ActiveUserData,
        )
    {
        return savePermanentByUrlPart(this, url, activeUser);
    }


    update
        (
            id: number,
            dto: UpdateResourceDto,
            activeUser: ActiveUserData,
        )
    {
        return updateEntityPart(this, id, dto, activeUser);
    }


    removeById
        (
            id: number,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntityByIdPart(this, id, activeUser);
    }


    removeByUrl
        (
            url: string,
            activeUser: ActiveUserData,
        )
    {
        return deleteEntityByUrlPart(this, url, activeUser);
    }


    removeByUrlSilent
        (
            url: string,
        )
    {
        return deleteEntityByUrlSilentPart(this, url);
    }


    removeSelf
        (
            entity: Resource,
        )
    {
        return deleteEntitySelfPart(this, entity);
    }


    @Cron(CronExpression.EVERY_DAY_AT_1AM)
    async cleanTemporaryFiles()
    {
        this.logger.log('Starting file cleanup...');

        const tempFiles = await this.repository.find({
            where: {
                status: ResourceStatus.TEMP
            }
        });
        tempFiles.forEach(file => this.removeSelf(file));

        this.logger.log(`File cleanup completed. Quantity: ${tempFiles.length}`);
    }
}
