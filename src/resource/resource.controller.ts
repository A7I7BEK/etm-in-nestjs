import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Query, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { DeleteResourceByIdDto } from './dto/delete-resource-by-id.dto';
import { DeleteResourceByUrlDto } from './dto/delete-resource-by-url.dto';
import { MinDimensionDto } from './dto/min-dimension.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';
import { validateUploadedFile, validateUploadedFiles } from './utils/resource.utils';


@ApiBearerAuth()
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
        validateUploadedFile(file);

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
        validateUploadedFiles(files);

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


    @Delete('id')
    removeById
        (
            @Body() dto: DeleteResourceByIdDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.removeById(dto.id, activeUser);
    }


    @Delete('url')
    removeByUrl
        (
            @Body() dto: DeleteResourceByUrlDto,
            @ActiveUser() activeUser: ActiveUserData,
        )
    {
        return this._service.removeByUrl(dto.url, activeUser);
    }
}
