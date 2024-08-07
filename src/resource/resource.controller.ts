import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

@ApiTags('resource')
@Controller('resource')
export class ResourceController
{
    constructor (private readonly resourceService: ResourceService) { }

    @Post('upload/file')
    create(@Body() createResourceDto: CreateResourceDto)
    {
        return this.resourceService.create(createResourceDto);
    }

    @Put('update')
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
