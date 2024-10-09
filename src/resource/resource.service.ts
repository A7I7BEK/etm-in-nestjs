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
        const { filePath, filename } = generateFilePath(file);
        file.path = filePath;
        file.filename = filename;

        if (MIME_TYPE_IMAGES.includes(file.mimetype) && +minDimensionDto.minWidth && +minDimensionDto.minHeight)
        {
            file.buffer = await this.resizeImage(file, +minDimensionDto.minWidth, +minDimensionDto.minHeight);
        }

        const resource = this.createResource(file);
        return this.saveFile(file, resource);
    }

    uploadMultipleFiles(files: Express.Multer.File[])
    {
        console.log(files);
        return { message: 'File uploaded successfully' };
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

    private resizeImage(file: Express.Multer.File, width: number, height: number)
    {
        return sharp(file.buffer)
            .resize({
                width,
                height,
                fit: sharp.fit.outside,
            })
            .toBuffer();
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
