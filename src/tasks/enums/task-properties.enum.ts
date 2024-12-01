
/**
 * temporary for this project:
 * properties are not appropriate,
 * change them to the real ones
 */
export enum TaskProperties
{
    ID = 'id',
    NAME = 'name',
    DEADLINE = 'deadLine',
    COLUMN_NAME = 'columnName',
    PROJECT_NAME = 'projectName',
}


export const TaskPropertiesReal = {
    [ TaskProperties.ID ]: 'id',
    [ TaskProperties.NAME ]: 'name',
    [ TaskProperties.DEADLINE ]: 'endDate',
    [ TaskProperties.COLUMN_NAME ]: 'column',
    [ TaskProperties.PROJECT_NAME ]: 'project',
} as const;