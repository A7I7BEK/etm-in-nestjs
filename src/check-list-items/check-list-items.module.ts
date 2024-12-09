import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckListGroupsModule } from 'src/check-list-groups/check-list-groups.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { TasksModule } from 'src/tasks/tasks.module';
import { CheckListItemsController } from './check-list-items.controller';
import { CheckListItemsService } from './check-list-items.service';
import { CheckListItem } from './entities/check-list-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ CheckListItem ]),
        forwardRef(() => CheckListGroupsModule),
        TasksModule,
        EmployeesModule,
    ],
    exports: [ CheckListItemsService ],
    controllers: [ CheckListItemsController ],
    providers: [ CheckListItemsService ],
})
export class CheckListItemsModule { }
