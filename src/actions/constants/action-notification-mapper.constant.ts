import { CheckListItemPermissions } from 'src/check-list-items/enums/check-list-item-permissions.enum';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';
import { TaskAttachmentPermissions } from 'src/task-attachments/enums/task-attachment-permissions.enum';
import { TaskCommentPermissions } from 'src/task-comments/enums/task-comment-permissions.enum';
import { TaskDeadlinePermissions } from 'src/task-deadline/enums/task-deadline-permissions.enum';
import { TaskMemberPermissions } from 'src/task-members/enums/task-member-permissions.enum';
import { TaskTagPermissions } from 'src/task-tags/enums/task-tag-permissions.enum';
import { TaskTimerPermissions } from 'src/task-timer/enums/task-timer-permissions.enum';
import { TaskPermissions } from 'src/tasks/enums/task-permissions.enum';


export const ACTION_NOTIFICATION_MAPPER = {
    [ TaskAttachmentPermissions.CREATE ]: NotificationType.TASK,
    [ TaskAttachmentPermissions.DELETE ]: NotificationType.TASK,
    [ TaskDeadlinePermissions.CREATE ]: NotificationType.TASK,
    [ TaskDeadlinePermissions.UPDATE ]: NotificationType.TASK,
    [ TaskDeadlinePermissions.DELETE ]: NotificationType.TASK,
    [ TaskMemberPermissions.CREATE ]: NotificationType.TASK,
    [ TaskMemberPermissions.DELETE ]: NotificationType.TASK,
    [ TaskTagPermissions.CREATE ]: NotificationType.TASK,
    [ TaskTagPermissions.DELETE ]: NotificationType.TASK,
    [ TaskTimerPermissions.START ]: NotificationType.TASK,
    [ TaskTimerPermissions.STOP ]: NotificationType.TASK,
    [ TaskPermissions.UPDATE ]: NotificationType.TASK,
    [ TaskPermissions.MOVE ]: NotificationType.TASK,
    [ TaskCommentPermissions.CREATE ]: NotificationType.COMMENT,
    [ TaskCommentPermissions.UPDATE ]: NotificationType.COMMENT,
    [ CheckListItemPermissions.CREATE ]: NotificationType.CHECK_LIST_ITEM,
};