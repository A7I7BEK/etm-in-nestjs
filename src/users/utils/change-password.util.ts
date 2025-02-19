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
            where: { id: dto.userId }
        },
        activeUser,
    );


    entity.password = await service.hashingService.hash(dto.newPassword);


    return service.repository.save(entity);
}
