import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ResourceModule } from 'src/resource/resource.module';
import { UsersModule } from 'src/users/users.module';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Employee ]),
        OrganizationsModule,
        ResourceModule,
        UsersModule,
    ],
    exports: [ EmployeesService ],
    controllers: [ EmployeesController ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        EmployeesService,
    ],
})
export class EmployeesModule { }
