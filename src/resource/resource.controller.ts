import { Body, Controller, Delete, NotAcceptableException, Param, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

@ApiTags('resource')
@Controller('resource')
export class ResourceController
{
    constructor (private readonly resourceService: ResourceService) { }

    @Post('upload/file')
    @UseInterceptors(FileInterceptor('file'))
    createOne(@UploadedFile() file: Express.Multer.File, @Query() minDimensionDto: MinDimensionDto)
    {
        if (!file)
        {
            throw new NotAcceptableException();
        }

        return this.resourceService.uploadFile(file, minDimensionDto);
    }

    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    createMany(@UploadedFiles() files: Express.Multer.File[])
    {
        if (!files || files.length === 0)
        {
            throw new NotAcceptableException();
        }

        return this.resourceService.uploadMultipleFiles(files);
    }

    @Put('update/:id')
    update(@Param('id') id: string, @Body() updateResourceDto: UpdateResourceDto)
    {
        return this.resourceService.update(+id, updateResourceDto);
    }

    @Delete('delete/:id')
    remove(@Param('id') id: string)
    {
        return this.resourceService.remove(+id);
    }
}
