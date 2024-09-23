import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController
{
    constructor (private readonly reportsService: ReportsService) { }

    @Post()
    create(@Body() createReportDto: CreateReportDto)
    {
        return this.reportsService.create(createReportDto);
    }

    @Get()
    findAll()
    {
        return this.reportsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.reportsService.findOne(+id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto)
    {
        return this.reportsService.update(+id, updateReportDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string)
    {
        return this.reportsService.remove(+id);
    }
}
