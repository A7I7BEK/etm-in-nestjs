import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { Resource } from './entities/resource.entity';
import { MIME_TYPE_IMAGES } from './utils/resource.constants';
import { generateFilePath } from './utils/resource.utils';

@Injectable()
export class ResourceService
{
    constructor (
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
    ) { }


    async uploadFile(file: Express.Multer.File, minDimensionDto: MinDimensionDto)
    {
        if (MIME_TYPE_IMAGES.includes(file.mimetype) && +minDimensionDto.minWidth && +minDimensionDto.minHeight)
        {
            return this.uploadFileResizedImage(file, +minDimensionDto.minWidth, +minDimensionDto.minHeight);
        }
        else
        {
            return this.uploadFileSimple(file);
        }
    }

    async uploadFileResizedImage(file: Express.Multer.File, width: number, height: number)
    {
        const { filePath, filename } = generateFilePath(file);
        file.path = filePath;
        file.filename = filename;

        file.buffer = await sharp(file.buffer).resize({ width, height, fit: sharp.fit.outside }).toBuffer();

        const resource = this.createResource(file);
        return this.saveFile(file, resource);
    }

    async uploadFileSimple(file: Express.Multer.File)
    {
        const { filePath, filename } = generateFilePath(file);
        file.path = filePath;
        file.filename = filename;

        const resource = this.createResource(file);
        return this.saveFile(file, resource);
    }

    async uploadMultipleFiles(files: Express.Multer.File[])
    {
        return Promise.all(
            files.map(file => this.uploadFileSimple(file))
        );
    }

    async findOne(id: number)
    {
        const entity = await this.resourceRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    update(id: number, name: string)
    {
        return this.findOne(id);
    }

    remove(id: number)
    {
        return this.findOne(id);
    }


    private createResource(file: Express.Multer.File)
    {
        const entity = new Resource();
        entity.url = file.path;
        entity.name = file.filename;
        entity.filename = file.filename;
        entity.mimetype = file.mimetype;
        entity.size = file.buffer.length;
        entity.sizeCalculated = file.buffer.length.toString();
        entity.createdAt = new Date();
        entity.now = new Date();

        return entity;
    }

    private async saveFile(file: Express.Multer.File, resource: Resource)
    {
        try
        {
            await fs.promises.writeFile(file.path, file.buffer);

            return this.resourceRepository.save(resource);
        }
        catch (error)
        {
            throw new InternalServerErrorException('Failed to save file');
        }
    }
}
