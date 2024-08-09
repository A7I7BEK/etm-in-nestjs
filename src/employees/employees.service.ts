import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeesService
{
    constructor (
        @InjectRepository(Employee)
        private readonly employeesRepository: Repository<Employee>,
    ) { }

    create(createEmployeeDto: CreateEmployeeDto)
    {
        const entity = this.employeesRepository.create({
            ...createEmployeeDto
        });
        return this.employeesRepository.save(entity);
    }

    findAll()
    {
        return this.employeesRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.employeesRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateEmployeeDto: UpdateEmployeeDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updateEmployeeDto);

        return this.employeesRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.employeesRepository.remove(entity);
    }
}
