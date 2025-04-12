
/**
 * WARNING: don't add slash before the base path
 * like that '/uploads'
 * It will be saved in the root folder of the system not the project
 * In windows: it will be the Disk (D:) if your project is in it
 */
export const DESTINATION_BASE = 'uploads';

export const DESTINATION_IMAGE = DESTINATION_BASE + '/image';
export const DESTINATION_AUDIO = DESTINATION_BASE + '/audio';
export const DESTINATION_VIDEO = DESTINATION_BASE + '/video';
export const DESTINATION_MICROSOFT_DOC = DESTINATION_BASE + '/ms-doc';
export const DESTINATION_OTHER_DOC = DESTINATION_BASE + '/other-doc';
export const DESTINATION_ARCHIVE = DESTINATION_BASE + '/archive';



export const MIME_TYPE_IMAGES = [ 'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp' ];
export const MIME_TYPE_AUDIOS = [ 'audio/aac', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm' ];
export const MIME_TYPE_VIDEOS = [ 'video/x-msvideo', 'video/mp4', 'video/mpeg', 'video/webm' ];
export const MIME_TYPE_MICROSOFT_DOCS = [
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.visio',
];
export const MIME_TYPE_OTHER_DOCS = [
    'application/vnd.oasis.opendocument.presentation', 'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.text', 'application/pdf',
];
export const MIME_TYPE_ARCHIVES = [ 'application/vnd.rar', 'application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed' ];

export const ALLOWED_MIME_TYPES = [
    ...MIME_TYPE_IMAGES,
    ...MIME_TYPE_AUDIOS,
    ...MIME_TYPE_VIDEOS,
    ...MIME_TYPE_MICROSOFT_DOCS,
    ...MIME_TYPE_OTHER_DOCS,
    ...MIME_TYPE_ARCHIVES,
];
