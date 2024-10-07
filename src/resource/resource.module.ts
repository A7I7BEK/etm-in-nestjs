import { Module, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { ALLOWED_MIME_TYPES, MAX_FILE_COUNT, MAX_FILE_SIZE } from './utils/resource.constants';

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
                    fileSize: MAX_FILE_SIZE,
                    files: MAX_FILE_COUNT,
                }
            }),
        }),
    ],
    controllers: [ ResourceController ],
    providers: [ ResourceService ],
})
export class ResourceModule { }
