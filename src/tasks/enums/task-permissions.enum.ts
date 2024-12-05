export enum TaskPermissions
{
    Create = 'TASK_CREATE',
    Read = 'TASK_READ',
    Update = 'TASK_UPDATE',
    Delete = 'TASK_DELETE',

    Move = 'TASK_MOVE',
    Copy = 'TASK_COPY',

    CheckCreate = 'TASK_CHECK_CREATE',
    CheckRead = 'TASK_CHECK_READ',
    CheckUpdate = 'TASK_CHECK_UPDATE',
    CheckDelete = 'TASK_CHECK_DELETE',

    AttachmentBind = 'TASK_ATTACHMENT_BIND',
    AttachmentRead = 'TASK_ATTACHMENT_READ',

    CommentCreate = 'TASK_COMMENT_CREATE',
    CommentRead = 'TASK_COMMENT_READ',

    ActionRead = 'TASK_ACTION_READ',

    TimeCreate = 'TASK_CREATE_TIME',
}