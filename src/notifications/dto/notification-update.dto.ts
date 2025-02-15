import { IsBoolean, IsInt, Min } from 'class-validator';

export class NotificationUpdateDto
{
    @IsBoolean()
    allNotification: boolean;

    @Min(1)
    @IsInt()
    notificationId: number;
}