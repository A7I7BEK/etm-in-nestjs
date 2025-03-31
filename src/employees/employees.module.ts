import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ResourceModule } from 'src/resource/resource.module';
import { UsersModule } from 'src/users/users.module';
import { EmployeesTypeormSubscriber } from './employees-typeorm.subscriber';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Employee ]),
        forwardRef(() => UsersModule),
        OrganizationsModule,
        ResourceModule,
    ],
    exports: [ EmployeesService ],
    controllers: [ EmployeesController ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        EmployeesService,
        EmployeesTypeormSubscriber,
    ],
})
export class EmployeesModule { }
