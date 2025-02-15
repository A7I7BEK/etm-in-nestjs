import { Body, Controller, Delete, NotAcceptableException, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

@ApiTags('resource')
@Controller('resource')
export class ResourceController
{
    constructor (private readonly _service: ResourceService) { }


    @Post('upload-one')
    @UseInterceptors(FileInterceptor('file'))
    createOne
        (
            @UploadedFile() file: Express.Multer.File,
            @Query() minDimensionDto: MinDimensionDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        if (!file)
        {
            throw new NotAcceptableException();
        }

        return this._service.uploadFile(file, minDimensionDto, activeUser);
    }


    @Post('upload-multiple')
    @UseInterceptors(FilesInterceptor('files'))
    createMany
        (
            @UploadedFiles() files: Express.Multer.File[],
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        if (!files || files.length === 0)
        {
            throw new NotAcceptableException();
        }

        return this._service.uploadMultipleFiles(files, activeUser);
    }


    @Put(':id')
    update
        (
            @Param('id', ParseIntPipe) id: number,
            @Body() updateDto: UpdateResourceDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.update(id, updateDto, activeUser);
    }


    @Delete(':id')
    remove
        (
            @Param('id', ParseIntPipe) id: number,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.remove(id, activeUser);
    }
}
