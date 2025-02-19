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
    // BINGO
    const foundUsers = await service.repository.find({
        where: [
            { userName: Equal(dto.userName) }, // BINGO
            { email: Equal(dto.email) }, // BINGO
            { phoneNumber: Equal(dto.phoneNumber) }, // BINGO
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
