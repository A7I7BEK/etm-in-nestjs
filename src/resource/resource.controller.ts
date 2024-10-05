import { Body, Controller, Delete, Param, Post, Put, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ResourceService } from './resource.service';

@ApiTags('resource')
@Controller('resource')
export class ResourceController
{
    constructor (private readonly resourceService: ResourceService) { }

    @Post('upload/file')
    @UseInterceptors(FileInterceptor('file'))
    createOne(@UploadedFile() file: Express.Multer.File)
    {
        return this.resourceService.uploadFile(file);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    createMany(@UploadedFiles() files: Express.Multer.File[])
    {
        return this.resourceService.uploadMultipleFiles(files);
    }

    @Put('update')
    update(@Param('id') id: string, @Body('name') name: string)
    {
        return this.resourceService.update(+id, name);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: string)
    {
        return this.resourceService.remove(+id);
    }
}
