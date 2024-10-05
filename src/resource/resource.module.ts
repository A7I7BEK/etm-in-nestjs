import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { FilenameGeneratorUtil } from './utils/filename-generator.util';
import { ALLOWED_MIME_TYPES, DESTINATION, MAX_FILE_SIZE } from './utils/resource.constants';

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: async () => ({
                storage: diskStorage({
                    destination: DESTINATION,
                    filename(req, file, callback)
                    {
                        const filename = FilenameGeneratorUtil(file);
                        callback(null, filename);
                    },
                }),
                fileFilter: (req, file, callback) =>
                {
                    if (ALLOWED_MIME_TYPES.includes(file.mimetype))
                    {
                        callback(null, true);
                    }
                    else
                    {
                        callback(new BadRequestException('Invalid file type'), false);
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
