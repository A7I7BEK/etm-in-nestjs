import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { ResourceTracker } from './entities/resource-tracker.entity';
import { Resource } from './entities/resource.entity';
import { ResourceTrackerService } from './resource-tracker.service';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';


@Module({
    imports: [
        // INFO: good setup but didn't work in frontend
        //
        // MulterModule.registerAsync({
        //     useFactory: async () => ({
        //         fileFilter: (req, file, callback) =>
        //         {
        //             if (ALLOWED_MIME_TYPES.includes(file.mimetype))
        //             {
        //                 callback(null, true);
        //             }
        //             else
        //             {
        //                 callback(new UnsupportedMediaTypeException(), false);
        //             }
        //         },
        //         limits: {
        //             fileSize: appConfig().file.maxSize,
        //             files: appConfig().file.maxCount,
        //         }
        //     }),
        // }),
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
