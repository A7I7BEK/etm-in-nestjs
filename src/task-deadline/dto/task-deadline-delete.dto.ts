import { OmitType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { TaskDeadlineUpdateDto } from './task-deadline-update.dto';

export class TaskDeadlineDeleteDto extends OmitType(TaskDeadlineUpdateDto, [ 'startDate', 'deadLine' ])
{
    @IsOptional()
    @IsBoolean()
    startDate?: boolean;

    @IsOptional()
    @IsBoolean()
    deadLine?: boolean;
}
