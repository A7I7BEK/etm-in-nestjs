
export const DESTINATION = './uploads';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const MAX_FILE_COUNT = 10;


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
