import { ConflictException } from '@nestjs/common';
import { Equal } from 'typeorm';
import { UserCheckUniqueValueDto } from '../dto/user-check-unique-value.dto';
import { UsersService } from '../users.service';


export async function checkUniqueValueUtil
    (
        service: UsersService,
        dto: UserCheckUniqueValueDto,
    )
{
    /**
     * BINGO
     * - There is a bug when retrieving record
     * using undefined or null values. Typeorm cannot
     * evaluate these values and simply returns all
     * records in this case.
     * - Using 'Equal' operator solves this problem
     */
    const foundUsers = await service.repository.find({
        where: [
            { userName: Equal(dto.userName) },
            { email: Equal(dto.email) },
            { phoneNumber: Equal(dto.phoneNumber) },
        ]
    });


    if (foundUsers.find(a => a.userName === dto.userName))
    {
        throw new ConflictException('Username already exists');
    }


    if (foundUsers.find(a => a.email === dto.email))
    {
        throw new ConflictException('Email already exists');
    }


    if (foundUsers.find(a => a.phoneNumber === dto.phoneNumber))
    {
        throw new ConflictException('Phone number already exists');
    }
}
