import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceService
{
    uploadFile(file: Express.Multer.File)
    {
        console.log(file);
        return { message: 'File uploaded successfully' };
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
}
