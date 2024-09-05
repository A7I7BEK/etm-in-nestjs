export enum TasksPermission
{
    Create = 'TASK_CREATE',
    Read = 'TASK_READ',
    Update = 'TASK_UPDATE',
    Delete = 'TASK_DELETE',

    Move = 'TASK_MOVE',
    Copy = 'TASK_COPY',

    MemberCreate = 'TASK_MEMBER_CREATE',
    MemberRead = 'TASK_MEMBER_READ',
    MemberDelete = 'TASK_MEMBER_DELETE',

    TagCreate = 'TASK_TAG_CREATE',
    TagRead = 'TASK_TAG_READ',
    TagUpdate = 'TASK_TAG_UPDATE',
    TagDelete = 'TASK_TAG_DELETE',

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