import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { OneTimePasswordParent } from './entities/one-time-password-parent.entity';
import { OneTimePassword } from './entities/one-time-password.entity';

@Injectable()
export class OneTimePasswordService
{
    constructor (
        @InjectRepository(OneTimePasswordParent)
        private readonly otpParentRepository: Repository<OneTimePasswordParent>,
        @InjectRepository(OneTimePassword)
        private readonly otpRepository: Repository<OneTimePassword>,
        private readonly hashingService: HashingService,
    ) { }

    private generateCode()
    {
        // 6 digit string
        return Math.random().toString().slice(-6);
    }

    private generateTime()
    {
        // +10 min
        return (Date.now() + 10 * 60 * 1000).toString();
    }


    async send(user: User)
    {
        const otpId = randomUUID();
        const otpCode = this.generateCode();

        this.otpParentRepository.save({
            uniqueId: otpId,
            user,
            otp: [
                await this.otpRepository.save({
                    code: otpCode,
                    expireTime: this.generateTime(),
                }),
            ],
        });


        return {
            id: otpId,
            code: otpCode,
        };
    }

    async resend(otpParent: OneTimePasswordParent)
    {
        const otpCode = this.generateCode();

        this.otpRepository.save({
            code: otpCode,
            expireTime: this.generateTime(),
            parent: otpParent,
        });


        return {
            code: otpCode,
        };
    }

    async confirm(id: string, code: string)
    {
        const otpEntity = await this.otpRepository.findOneBy({
            parent: { uniqueId: id },
            code,
        });

        if (!otpEntity && otpEntity.used && Number(otpEntity.expireTime) < Date.now())
        {
            throw new BadRequestException();
        }
    }

    async confirmWithPassword(id: string, code: string, password: string)
    {
        await this.confirm(id, code);

        const parent = await this.findOne(id);
        const isEqual = await this.hashingService.compare(password, parent.user.password);

        if (!isEqual)
        {
            throw new BadRequestException();
        }
    }

    async findOne(id: string)
    {
        const entity = await this.otpParentRepository.findOneBy({ uniqueId: id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }
}
