import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Controller('resource')
export class ResourceController
{
    constructor (private readonly resourceService: ResourceService) { }

    @Post('upload/file')
    create(@Body() createResourceDto: CreateResourceDto)
    {
        return this.resourceService.create(createResourceDto);
    }

    @Patch('update/:id')
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
