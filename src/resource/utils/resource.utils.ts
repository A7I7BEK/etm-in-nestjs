import * as fs from 'fs';
import * as path from 'path';
import
{
    DESTINATION_ARCHIVE,
    DESTINATION_AUDIO,
    DESTINATION_BASE,
    DESTINATION_IMAGE,
    DESTINATION_MICROSOFT_DOC,
    DESTINATION_OTHER_DOC,
    DESTINATION_VIDEO,
    MIME_TYPE_ARCHIVES,
    MIME_TYPE_AUDIOS,
    MIME_TYPE_IMAGES,
    MIME_TYPE_MICROSOFT_DOCS,
    MIME_TYPE_OTHER_DOCS,
    MIME_TYPE_VIDEOS
} from './resource.constants';


// BINGO
export function generateFilename(file: Express.Multer.File)
{
    const dateTimeSuffix = new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '_');
    const randomSuffix = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '_' + dateTimeSuffix + '_' + randomSuffix + ext;

    return filename;
}


export function getDestination(file: Express.Multer.File)
{
    if (MIME_TYPE_IMAGES.includes(file.mimetype))
    {
        return DESTINATION_IMAGE;
    }
    else if (MIME_TYPE_AUDIOS.includes(file.mimetype))
    {
        return DESTINATION_AUDIO;
    }
    else if (MIME_TYPE_VIDEOS.includes(file.mimetype))
    {
        return DESTINATION_VIDEO;
    }
    else if (MIME_TYPE_MICROSOFT_DOCS.includes(file.mimetype))
    {
        return DESTINATION_MICROSOFT_DOC;
    }
    else if (MIME_TYPE_OTHER_DOCS.includes(file.mimetype))
    {
        return DESTINATION_OTHER_DOC;
    }
    else if (MIME_TYPE_ARCHIVES.includes(file.mimetype))
    {
        return DESTINATION_ARCHIVE;
    }
    else
    {
        return DESTINATION_BASE;
    }
}


// BINGO
export function generateFilePath(file: Express.Multer.File)
{
    const destination = getDestination(file);

    if (!fs.existsSync(destination))
    {
        fs.mkdirSync(destination, { recursive: true });
    }

    const filename = generateFilename(file);
    const filePath = path.posix.join(destination, filename); // BINGO

    return { filePath, filename };
}


// BINGO
export function calculateFileSize(size: number)
{
    const units = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let i = 0;

    while (size >= 1024)
    {
        size /= 1024;
        i++;
    }

    return size.toFixed(2) + ' ' + units[ i ];
}


export function calculateFileSizeAlternative(size: number)
{
    const units = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ];
    const i = size >= 1 ? Math.floor(Math.log(size) / Math.log(1024)) : 0;

    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[ i ]}`;
}