import { TaskComment } from '../entities/task-comment.entity';
import { TaskCommentType } from '../enums/task-comment-type.enum';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskComment)
{
    const { author, members, task } = entity;


    Object.assign(entity, {
        commentType: {
            id: entity.commentType,
            name: TaskCommentType[ entity.commentType ],
            value: TaskCommentType[ entity.commentType ],
        },
    });


    if (author)
    {
        delete entity.author.user?.password;

        Object.assign(entity, {
            authorId: author.id,
            firstName: author.firstName,
            lastName: author.lastName,
            middleName: author.middleName,
            photoUrl: author.photoUrl,
            birthDate: author.birthDate,
            userId: author.user?.id,
            userName: author.user?.userName,
        });
    }


    if (members)
    {
        members.forEach(item =>
        {
            delete item.user?.password;

            Object.assign(item, {
                employee: {
                    firstName: item.firstName,
                    lastName: item.lastName,
                    middleName: item.middleName,
                    userId: item.user?.id,
                    userName: item.user?.userName,
                }
            });
        });
    }


    if (task)
    {
        Object.assign(entity, {
            taskId: task.id,
            taskName: task.name,
        });
    }


    return entity;
}