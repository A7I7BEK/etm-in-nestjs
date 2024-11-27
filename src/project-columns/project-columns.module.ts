import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectColumn } from './entities/project-column.entity';
import { ProjectColumnsController } from './project-columns.controller';
import { ProjectColumnsService } from './project-columns.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectColumn ]),
        forwardRef(() => ProjectsModule), // BINGO
    ],
    exports: [ ProjectColumnsService ],
    controllers: [ ProjectColumnsController ],
    providers: [ ProjectColumnsService ],
})
export class ProjectColumnsModule { }
