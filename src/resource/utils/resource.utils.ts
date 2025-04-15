import
{
    BadRequestException,
    NotAcceptableException,
    PayloadTooLargeException,
    UnsupportedMediaTypeException
} from '@nestjs/common';
import * as path from 'path';
import appConfig from 'src/common/config/app.config';
import
{
    ALLOWED_MIME_TYPES,
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


// BINGO: generate unique file name using dateTime and random numbers
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


// BINGO: generate file path based on file type
export function generateFilePath(file: Express.Multer.File)
{
    const destination = getDestination(file);
    const filename = generateFilename(file);
    const filePath = path.posix.join(destination, filename); // BINGO: use Linux based path, not Windows based

    return { filePath, filename };
}


// BINGO: generate posix style full path
export function generateFullPath(filePath: string)
{
    return path.posix.join(path.posix.resolve('.'), filePath);
}


// BINGO: calculate readable file size
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


export function validateUploadedFile(file: Express.Multer.File)
{
    if (!file)
    {
        throw new BadRequestException('No file uploaded');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype))
    {
        throw new UnsupportedMediaTypeException();
    }

    if (file.size > appConfig().file.maxSize)
    {
        throw new PayloadTooLargeException();
    }
}


export function validateUploadedFiles(files: Express.Multer.File[])
{
    if (!files || files.length === 0)
    {
        throw new BadRequestException('No file uploaded');
    }

    if (files.length > appConfig().file.maxCount)
    {
        throw new NotAcceptableException('Too many files');
    }

    files.forEach(file => validateUploadedFile(file));
}