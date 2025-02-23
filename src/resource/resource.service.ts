import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { setNestedOptions } from 'src/common/utils/set-nested-options.util';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { createEntity } from './utils/create-entity.util';
import { MIME_TYPE_IMAGES } from './utils/resource.constants';


@Injectable()
export class ResourceService
{
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
            return this.uploadResizedImage(file, width, height, activeUser);
        }
        else
        {
            return this.uploadSimple(file, activeUser);
        }
    }


    async uploadResizedImage
        (
            file: Express.Multer.File,
            width: number,
            height: number,
            activeUser: ActiveUserData,
        )
    {
        file.buffer = await sharp(file.buffer)
            .resize({
                width,
                height,
                fit: sharp.fit.outside,
            })
            .toBuffer();

        return this.uploadSimple(file, activeUser);
    }


    uploadSimple // BINGO: simplified upload function for later use
        (
            file: Express.Multer.File,
            activeUser: ActiveUserData,
        )
    {
        return createEntity(this, file, activeUser);
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


    async update
        (
            id: number,
            updateDto: UpdateResourceDto,
            activeUser: ActiveUserData,
        )
    {
        const entity = await this.findOne(
            {
                where: { id }
            },
            activeUser,
        );
        entity.name = updateDto.name + path.extname(entity.filename);
        entity.updatedAt = new Date();

        return this.repository.save(entity);
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

        try
        {
            await fs.promises.rm(entity.url);
        }
        catch (error)
        {
            console.log(`Failed to remove file with id: ${entity.id}`, error);
        }

        return this.repository.remove(entity);
    }
}
