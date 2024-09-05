import { Module } from '@nestjs/common';
import { CheckListGroupsService } from './check-list-groups.service';
import { CheckListGroupsController } from './check-list-groups.controller';

@Module({
    controllers: [ CheckListGroupsController ],
    providers: [ CheckListGroupsService ],
})
export class CheckListGroupsModule { }
