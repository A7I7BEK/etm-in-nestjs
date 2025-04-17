import { BadRequestException } from '@nestjs/common';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserChangePasswordDto } from '../dto/user-change-password.dto';
import { UsersService } from '../users.service';


export async function changePasswordUtil
    (
        service: UsersService,
        dto: UserChangePasswordDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: {
                id: activeUser.sub,
            }
        },
        activeUser,
    );


    const isEqual = await service.hashingService.compare(dto.currentPassword, entity.password);
    if (!isEqual)
    {
        throw new BadRequestException('Current password is incorrect');
    }


    entity.password = await service.hashingService.hash(dto.newPassword);


    return service.repository.save(entity);
}
