import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { MIME_TYPE_IMAGES } from './utils/resource.constants';
import { generateFilename, getDestination } from './utils/resource.utils';

@Injectable()
export class ResourceService
{
    async uploadFile(file: Express.Multer.File, minDimensionDto: MinDimensionDto)
    {

        const filePath = this.generateFilePath(file);

        if (MIME_TYPE_IMAGES.includes(file.mimetype) && minDimensionDto.minWidth && minDimensionDto.minHeight)
        {
            const resizedImageBuffer = await this.resizeImage(file);
            return this.saveFile(filePath, resizedImageBuffer);
        }

        return this.saveFile(filePath, file.buffer);
    }

    uploadMultipleFiles(files: Express.Multer.File[])
    {
        console.log(files);
        return { message: 'File uploaded successfully' };
    }

    update(id: number, name: string)
    {
        return `This action updates a #${id} resource`;
    }

    remove(id: number)
    {
        return `This action removes a #${id} resource`;
    }


    private generateFilePath(file: Express.Multer.File)
    {
        const destination = getDestination(file);

        if (!fs.existsSync(destination))
        {
            fs.mkdirSync(destination, { recursive: true });
        }

        const filename = generateFilename(file);
        const filePath = path.join(destination, filename);

        return filePath;
    }

    private async resizeImage(file: Express.Multer.File)
    {
        return await sharp(file.buffer)
            .resize(800, 800, {
                fit: sharp.fit.cover,
                position: sharp.strategy.entropy
            })
            .toBuffer();

        // const croppedImage = await sharp(file.buffer)
        //     .resize(200, 200) // Adjust the desired dimensions
        //     .crop(sharp.gravity.center)
        //     .toBuffer();

        // const resizedImage = await sharp(file.buffer)
        //     .resize(800, 600) // Set your desired dimensions
        //     .toBuffer();
    }

    private async saveFile(filePath: string, fileBuffer: Buffer)
    {
        try
        {
            await fs.promises.writeFile(filePath, fileBuffer);

            return {
                message: 'File uploaded successfully',
                filePath,
            };
        }
        catch (error)
        {
            throw new Error('Failed to save file');
        }
    }
}
