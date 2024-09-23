import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CheckListGroupsService } from './check-list-groups.service';
import { CreateCheckListGroupDto } from './dto/create-check-list-group.dto';
import { UpdateCheckListGroupDto } from './dto/update-check-list-group.dto';

@Controller('check-list-groups')
export class CheckListGroupsController
{
    constructor (private readonly checkListGroupsService: CheckListGroupsService) { }

    @Post()
    create(@Body() createCheckListGroupDto: CreateCheckListGroupDto)
    {
        return this.checkListGroupsService.create(createCheckListGroupDto);
    }

    @Get()
    findAll()
    {
        return this.checkListGroupsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.checkListGroupsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateCheckListGroupDto: UpdateCheckListGroupDto)
    {
        return this.checkListGroupsService.update(+id, updateCheckListGroupDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string)
    {
        return this.checkListGroupsService.remove(+id);
    }
}
