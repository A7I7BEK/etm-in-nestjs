import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ResourceController } from './resource.controller';
import { ResourceService } from './resource.service';
import { FilenameGenerator } from './utils/filename-generator';
import { ALLOWED_MIME_TYPES, DESTINATION, MAX_FILE_COUNT, MAX_FILE_SIZE } from './utils/resource.constants';

@Module({
    imports: [
        MulterModule.registerAsync({
            useFactory: async () => ({
                storage: diskStorage({
                    destination: DESTINATION,
                    filename(req, file, callback)
                    {
                        const filename = FilenameGenerator(file);
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
