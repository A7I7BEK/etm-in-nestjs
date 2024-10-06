import { extname } from 'path';

export function FilenameGenerator(file: Express.Multer.File)
{
    const dateTimeSuffix = new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '_');
    const randomSuffix = Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
    const filename = file.fieldname + '_' + dateTimeSuffix + '_' + randomSuffix + ext;

    return filename;
}