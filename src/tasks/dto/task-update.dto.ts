import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskLevel } from '../enums/task-level.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class TaskUpdateDto
{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(TaskLevel)
    level?: TaskLevel;

    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;
}