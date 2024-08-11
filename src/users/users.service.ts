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
        private readonly userRepository: Repository<User>,
    ) { }

    create(createUserDto: CreateUserDto)
    {
        const entity = this.userRepository.create({
            ...createUserDto
        });
        return this.userRepository.save(entity);
    }

    findAll()
    {
        return this.userRepository.find();
    }

    async findOne(id: number)
    {
        const entity = await this.userRepository.findOneBy({ id });

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

        return this.userRepository.save(entity);
    }

    async remove(id: number)
    {
        const entity = await this.findOne(id);
        return this.userRepository.remove(entity);
    }
}
