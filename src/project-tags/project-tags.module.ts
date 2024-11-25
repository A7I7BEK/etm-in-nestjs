import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from 'src/projects/projects.module';
import { ProjectTag } from './entities/project-tag.entity';
import { ProjectTagsController } from './project-tags.controller';
import { ProjectTagsService } from './project-tags.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ ProjectTag ]),
        ProjectsModule,
    ],
    exports: [ ProjectTagsService ],
    controllers: [ ProjectTagsController ],
    providers: [ ProjectTagsService ],
})
export class ProjectTagsModule { }
