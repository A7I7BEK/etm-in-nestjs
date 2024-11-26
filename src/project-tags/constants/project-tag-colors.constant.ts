import { ProjectTag } from '../entities/project-tag.entity';

export const PROJECT_TAG_COLORS: Pick<ProjectTag, 'name' | 'color'>[] = [
    {
        name: 'RED',
        color: '#ff0000',
    },
    {
        name: 'BLUE',
        color: '#0000ff',
    },
    {
        name: 'GREEN',
        color: '#008000',
    },
];