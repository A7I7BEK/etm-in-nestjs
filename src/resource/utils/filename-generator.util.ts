import { extname } from 'path';

export function FilenameGeneratorUtil(file: Express.Multer.File)
{
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const dateTimeSuffix = year + month + day + '_' + hours + minutes + seconds;
    const randomSuffix = Math.round(Math.random() * 1E9);
    const uniqueSuffix = file.fieldname + '_' + dateTimeSuffix + '_' + randomSuffix;

    const ext = extname(file.originalname);
    const filename = uniqueSuffix + ext;

    return filename;
}