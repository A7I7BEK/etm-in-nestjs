import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService
{
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    create(createUserDto: CreateUserDto)
    {
        const entity = this.usersRepository.create({
            ...createUserDto
        });
        return this.usersRepository.save(entity);
    }

    findAll()
    {
        return this.usersRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.usersRepository.findOneBy({ id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }

    async update(id: number, updateUserDto: UpdateUserDto)
    {
        const entity = await this.findOne(id);

        Object.assign(entity, updateUserDto);

        return this.usersRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.usersRepository.remove(entity);
    }
}
