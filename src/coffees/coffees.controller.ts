import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enum';

@Auth(AuthType.Bearer)
@Controller('coffees')
export class CoffeesController
{
    constructor (private readonly coffeesService: CoffeesService) { }

    @Roles(Role.Regular)
    @Post()
    create(@Body() createCoffeeDto: CreateCoffeeDto)
    {
        return this.coffeesService.create(createCoffeeDto);
    }

    @Get()
    findAll(@ActiveUser() user: ActiveUserData)
    {
        return {
            coffee: this.coffeesService.findAll(),
            user,
        };
    }

    @Get(':id')
    findOne(@Param('id') id: string)
    {
        return this.coffeesService.findOne(+id);
    }

    @Roles(Role.Admin)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto)
    {
        return this.coffeesService.update(+id, updateCoffeeDto);
    }

    @Roles(Role.Admin)
    @Delete(':id')
    remove(@Param('id') id: string)
    {
        return this.coffeesService.remove(+id);
    }
}
