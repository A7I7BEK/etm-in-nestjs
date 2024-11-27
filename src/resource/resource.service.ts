import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';
import { MIME_TYPE_IMAGES } from './utils/resource.constants';
import { calculateFileSize, generateFilePath } from './utils/resource.utils';

@Injectable()
export class ResourceService
{
    constructor (
        @InjectRepository(Resource)
        public readonly repository: Repository<Resource>,
    ) { }


    uploadFile
        (
            file: Express.Multer.File,
            minDimensionDto: MinDimensionDto,
        )
    {
        if (
            MIME_TYPE_IMAGES.includes(file.mimetype)
            && minDimensionDto.minWidth
            && minDimensionDto.minHeight
        )
        {
            return this.uploadResizedImage(
                file,
                minDimensionDto.minWidth,
                minDimensionDto.minHeight,
            );
        }
        else
        {
            return this.uploadSimple(file);
        }
    }


    async uploadResizedImage
        (
            file: Express.Multer.File,
            width: number,
            height: number,
        )
    {
        const { filePath, filename } = generateFilePath(file);
        file.path = filePath;
        file.filename = filename;

        file.buffer = await sharp(file.buffer).resize({ width, height, fit: sharp.fit.outside }).toBuffer();

        const resource = this.createResource(file);
        return this.saveFile(file, resource);
    }


    uploadSimple // BINGO
        (
            file: Express.Multer.File,
        )
    {
        const { filePath, filename } = generateFilePath(file);
        file.path = filePath;
        file.filename = filename;

        const resource = this.createResource(file);
        return this.saveFile(file, resource);
    }


    uploadMultipleFiles
        (
            files: Express.Multer.File[],
        )
    {
        return Promise.all(files.map(file => this.uploadSimple(file))); // BINGO
    }


    async findOne
        (
            where: FindOptionsWhere<Resource>,
            relations?: FindOptionsRelations<Resource>,
        )
    {
        const entity = await this.repository.findOne({ where, relations });

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
        )
    {
        const entity = await this.findOne({ id });
        entity.name = updateDto.name + path.extname(entity.filename);
        entity.updatedAt = new Date();
        entity.now = new Date();

        return this.repository.save(entity);
    }


    async remove
        (
            id: number,
        )
    {
        const entity = await this.findOne({ id });
        return this.removeFile(entity);
    }


    async removeFile
        (
            entity: Resource,
        )
    {
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


    private createResource
        (
            file: Express.Multer.File,
        )
    {
        const entity = new Resource();
        entity.url = file.path;
        entity.name = file.filename;
        entity.filename = file.filename;
        entity.mimetype = file.mimetype;
        entity.size = file.buffer.length; // BINGO
        entity.sizeCalculated = calculateFileSize(file.buffer.length);
        entity.createdAt = new Date();
        entity.updatedAt = new Date();
        entity.now = new Date();

        return entity;
    }


    private async saveFile
        (
            file: Express.Multer.File,
            resource: Resource,
        )
    {
        try
        {
            await fs.promises.writeFile(file.path, file.buffer);

            return this.repository.save(resource);
        }
        catch (error)
        {
            throw new InternalServerErrorException('Failed to save file');
        }
    }
}
