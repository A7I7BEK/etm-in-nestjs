import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
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
        private readonly mailService: MailService,
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

        const otpParent = new OneTimePasswordParent();
        otpParent.uniqueId = otpId;
        otpParent.user = user;
        await this.otpParentRepository.save(otpParent);

        const otpEntity = new OneTimePassword();
        otpEntity.code = otpCode;
        otpEntity.expireTime = this.generateTime();
        otpEntity.parent = otpParent;
        await this.otpRepository.save(otpEntity);

        await this.mailService.sendOtpCode(user, otpCode);

        return { id: otpId };
    }

    async resend(id: string)
    {
        const otpParent = await this.findOneParent(id);

        const otpCode = this.generateCode();

        const otpEntity = new OneTimePassword();
        otpEntity.code = otpCode;
        otpEntity.expireTime = this.generateTime();
        otpEntity.parent = otpParent;
        await this.otpRepository.save(otpEntity);

        await this.mailService.sendOtpCode(otpParent.user, otpCode);
    }

    async confirm(id: string, code: string)
    {
        const otpEntity = await this.otpRepository.findOneBy({
            parent: { uniqueId: id },
            code,
        });

        if (!otpEntity || otpEntity.used || Number(otpEntity.expireTime) < Date.now())
        {
            throw new BadRequestException();
        }

        otpEntity.used = true;
        await this.otpRepository.save(otpEntity);
    }

    async confirmWithPassword(id: string, code: string, password: string)
    {
        await this.confirm(id, code);

        const otpParent = await this.findOneParent(id);
        const isEqual = await this.hashingService.compare(password, otpParent.user.password);

        if (!isEqual)
        {
            throw new BadRequestException();
        }

        return otpParent.user;
    }

    async findOneParent(id: string)
    {
        const entity = await this.otpParentRepository.findOneBy({ uniqueId: id });

        if (!entity)
        {
            throw new NotFoundException();
        }

        return entity;
    }
}
