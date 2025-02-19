import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { OneTimePasswordParent } from './entities/one-time-password-parent.entity';
import { OneTimePassword } from './entities/one-time-password.entity';
import { OtpSendingOptions } from './interfaces/otp-sending-options.interface';

@Injectable()
export class OneTimePasswordService
{
    constructor (
        @InjectRepository(OneTimePasswordParent)
        private readonly otpParentRepository: Repository<OneTimePasswordParent>,
        @InjectRepository(OneTimePassword)
        private readonly otpRepository: Repository<OneTimePassword>,
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

    private async decideSendChannel(otpCode: string, user: User, options: Partial<OtpSendingOptions>) // BINGO
    {
        if (options.email)
        {
            await this.mailService.sendOtpCodeUser(user, otpCode);
        }

        if (options.phone)
        {
            // TODO: implement SMS (phone number) service
        }
    }


    async send(user: User, options: Partial<OtpSendingOptions>)
    {
        const otpId = randomUUID();
        const otpCode = this.generateCode();

        const otpParent = new OneTimePasswordParent();
        otpParent.uniqueId = otpId;
        otpParent.options = options;
        otpParent.user = user;
        await this.otpParentRepository.save(otpParent);

        const otpEntity = new OneTimePassword();
        otpEntity.code = otpCode;
        otpEntity.expireTime = this.generateTime();
        otpEntity.parent = otpParent;
        await this.otpRepository.save(otpEntity);

        await this.decideSendChannel(otpCode, user, options);

        return { otpId };
    }

    async resend(otpId: string)
    {
        const otpParent = await this.findOneParent(otpId);

        const otpCode = this.generateCode();

        const otpEntity = new OneTimePassword();
        otpEntity.code = otpCode;
        otpEntity.expireTime = this.generateTime();
        otpEntity.parent = otpParent;
        await this.otpRepository.save(otpEntity);

        await this.decideSendChannel(otpCode, otpParent.user, otpParent.options);
    }

    async confirm(otpId: string, otpCode: string)
    {
        const otpEntity = await this.otpRepository.findOneBy({
            parent: { uniqueId: otpId }, // BINGO
            code: otpCode,
        });

        if (!otpEntity || otpEntity.used || Date.now() > Number(otpEntity.expireTime))
        {
            throw new BadRequestException();
        }

        otpEntity.used = true;
        await this.otpRepository.save(otpEntity);

        const otpParent = await this.findOneParent(otpId);

        return otpParent.user;
    }

    async findOneParent(otpId: string)
    {
        const entity = await this.otpParentRepository.findOneBy({ uniqueId: otpId });

        if (!entity)
        {
            throw new NotFoundException(`${OneTimePasswordParent.name} not found`);
        }

        return entity;
    }
}
