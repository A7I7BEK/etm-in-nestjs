import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { TaskTimer } from './entities/task-timer.entity';
import { TaskTimerController } from './task-timer.controller';
import { TaskTimerService } from './task-timer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ TaskTimer ]),
        OrganizationsModule,
        PermissionsModule,
    ],
    exports: [ TaskTimerService ],
    controllers: [ TaskTimerController ],
    providers: [ TaskTimerService ],
})
export class TaskTimerModule { }
