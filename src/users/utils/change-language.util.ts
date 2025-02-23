import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { UserChangeLanguageDto } from '../dto/user-change-language.dto';
import { LanguageKey } from '../language/language.enum';
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


    /**
     * Old Method
     * BINGO: get key name using value
     */
    // const languageName = Object.keys(Language).find(key => Language[ key ] === dto.langCode) as (keyof typeof Language);


    entity.language.code = dto.langCode;
    entity.language.name = LanguageKey[ dto.langCode ]; // BINGO: get key name using value


    return service.repository.save(entity);
}
