import { extname } from 'path';
import
{
    DESTINATION_ARCHIVE,
    DESTINATION_AUDIO,
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


export function generateFilename(file: Express.Multer.File)
{
    const dateTimeSuffix = new Date().toISOString().replace(/[-:.Z]/g, '').replace('T', '_');
    const randomSuffix = Math.round(Math.random() * 1E9);
    const ext = extname(file.originalname);
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
}