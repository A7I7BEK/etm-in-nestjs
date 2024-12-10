import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from 'src/tasks/tasks.module';
import { CheckListGroupsController } from './check-list-groups.controller';
import { CheckListGroupsService } from './check-list-groups.service';
import { CheckListGroup } from './entities/check-list-group.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ CheckListGroup ]),
        forwardRef(() => TasksModule),
    ],
    exports: [ CheckListGroupsService ],
    controllers: [ CheckListGroupsController ],
    providers: [ CheckListGroupsService ],
})
export class CheckListGroupsModule { }
