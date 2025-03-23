import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { ResourceModule } from 'src/resource/resource.module';
import { RolesModule } from 'src/roles/roles.module';
import { User } from './entities/user.entity';
import { ActiveUsersGateway } from './gateways/active-user.gateway';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User ]),
        forwardRef(() => EmployeesModule),
        RolesModule,
        ResourceModule,
    ],
    exports: [ UsersService ],
    controllers: [ UsersController ],
    providers: [
        {
            provide: HashingService,
            useClass: BcryptService,
        },
        UsersService,
        ActiveUsersGateway,
    ],
})
export class UsersModule { }
