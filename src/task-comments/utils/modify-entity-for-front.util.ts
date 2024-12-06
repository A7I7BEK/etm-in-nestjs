import { TaskComment } from '../entities/task-comment.entity';

/**
 * temporary for this project, must not exist
 */
export function modifyEntityForFront(entity: TaskComment)
{
    const { author, members, task } = entity;


    if (author)
    {
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