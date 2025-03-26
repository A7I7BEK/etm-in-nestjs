import { NotFoundException } from '@nestjs/common';
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
    const hashedPassword = await service.hashingService.hash(dto.currentPassword);


    const entity = await service.findOne(
        {
            where: {
                id: activeUser.sub,
                password: hashedPassword,
            }
        },
        activeUser,
    );


    if (!entity)
    {
        throw new NotFoundException('User not found');
    }


    entity.password = await service.hashingService.hash(dto.newPassword);


    return service.repository.save(entity);
}
