import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserChangeLanguageDto } from '../dto/user-change-language.dto';
import { Language } from '../language/language.enum';
import { UsersService } from '../users.service';


export async function changeLanguageUtil
    (
        service: UsersService,
        dto: UserChangeLanguageDto,
        activeUser: ActiveUserData,
    )
{
    const entity = await service.findOne(
        {
            where: { id: activeUser.sub }
        },
        activeUser,
    );


    // BINGO
    const languageName = Object.keys(Language).find(key => Language[ key ] === dto.langCode) as (keyof typeof Language);


    entity.language.code = dto.langCode;
    entity.language.name = languageName;


    return service.repository.save(entity);
}
