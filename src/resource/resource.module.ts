import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ResourceTracker } from './entities/resource-tracker.entity';
import { Resource } from './entities/resource.entity';
import { ResourceTrackerService } from './resource-tracker.service';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ALLOWED_MIME_TYPES } from './utils/resource.constants';


@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: async () => ({
                fileFilter: (req, file, callback) =>
                {
                    if (ALLOWED_MIME_TYPES.includes(file.mimetype))
                    {
                        callback(null, true);
                    }
                    else
                    {
                        callback(new UnsupportedMediaTypeException(), false);
                    }
                },
                limits: {
                    fileSize: appConfig().file.maxSize,
                    files: appConfig().file.maxCount,
                }
            }),
        }),
        TypeOrmModule.forFeature([
            Resource,
            ResourceTracker,
        ]),
        OrganizationsModule,
    ],
    exports: [
        ResourceService,
        ResourceTrackerService,
    ],
    controllers: [ ResourceController ],
    providers: [
        ResourceService,
        ResourceTrackerService,
    ],
})
export class ResourceModule { }
