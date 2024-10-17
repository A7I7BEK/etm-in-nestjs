import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Group ]),
        EmployeesModule,
    ],
    controllers: [ GroupsController ],
    providers: [ GroupsService ],
})
export class GroupsModule { }
