import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from 'src/common/config/app.config';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { Resource } from './entities/resource.entity';
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
        TypeOrmModule.forFeature([ Resource ]),
        OrganizationsModule,
    ],
    exports: [ ResourceService ],
    controllers: [ ResourceController ],
    providers: [ ResourceService ],
})
export class ResourceModule { }
