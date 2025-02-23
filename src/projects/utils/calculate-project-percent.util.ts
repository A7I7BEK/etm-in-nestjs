import { ProjectColumnTypeKanban } from 'src/project-columns/enums/project-column-type-kanban.enum';
import { Project } from '../entities/project.entity';
import { ProjectType } from '../enums/project-type.enum';


export function calculateProjectPercent(entity: Project)
{
    const { tasks } = entity;

    // TODO: check if it is working
    if (entity.projectType !== ProjectType.KANBAN || !tasks)
    {
        return entity;
    }
    else if (tasks.length === 0)
    {
        Object.assign(entity, { percent: 0 });
        return entity;
    }


    const totalCount = tasks.length;
    const checkedCount = tasks.filter(item => item.column.name === ProjectColumnTypeKanban.ARCHIVE).length;
    const percent = Math.floor(checkedCount / totalCount * 100);


    Object.assign(entity, { percent });
    delete entity.tasks;


    return entity;
}
