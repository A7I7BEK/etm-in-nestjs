import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectColumn } from './entities/project-column.entity';
import { ProjectColumnsGateway } from './gateways/project-columns.gateway';
import { ProjectColumnsController } from './project-columns.controller';
import { ProjectColumnsService } from './project-columns.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectColumn ]),
        forwardRef(() => ProjectsModule), // BINGO: Circular dependency problem solved
    ],
    exports: [ ProjectColumnsService ],
    controllers: [ ProjectColumnsController ],
    providers: [
        ProjectColumnsService,
        ProjectColumnsGateway,
    ],
})
export class ProjectColumnsModule { }
