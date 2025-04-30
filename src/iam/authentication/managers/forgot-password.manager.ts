import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OtpSendingOptions } from 'src/one-time-password/interfaces/otp-sending-options.interface';
import { OneTimePasswordService } from 'src/one-time-password/one-time-password.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HashingService } from '../../hashing/hashing.service';
import { ForgotPasswordChangeDto } from '../dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from '../dto/forgot-password-confirm.dto';
import { ForgotPasswordResendDto } from '../dto/forgot-password-resend.dto';
import { ForgotPasswordSendDto } from '../dto/forgot-password-send.dto';
import { ForgotPassword } from '../entities/forgot-password.entity';

@Injectable()
export class ForgotPasswordManager
{
    constructor (
        @InjectRepository(ForgotPassword)
        public readonly repository: Repository<ForgotPassword>,
        public readonly usersService: UsersService,
        public readonly hashingService: HashingService,
        public readonly oneTimePasswordService: OneTimePasswordService,
    ) { }


    async forgotPasswordSend(forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        const { contactEmailOrPhone: contact } = forgotPasswordSendDto;
        const options: Partial<OtpSendingOptions> = {}; // BINGO: special type
        const userFindOptions: FindOptionsWhere<User> = {}; // BINGO: use in-built typeorm type

        if (Number(contact))
        {
            options.phone = true;
            userFindOptions.phoneNumber = contact;
        }
        else if (contact.includes('@'))
        {
            options.email = true;
            userFindOptions.email = contact;
        }

        const user = await this.usersService.repository.findOne({
            where: userFindOptions,
            relations: {
                employee: true,
            },
        });
        if (!user)
        {
            throw new NotFoundException(`${User.name} not found`);
        }

        console.log('forgotPasswordSend', user, options);

        return this.oneTimePasswordService.send(user, options);
    }


    async forgotPasswordResend(forgotPasswordResendDto: ForgotPasswordResendDto)
    {
        await this.oneTimePasswordService.resend(forgotPasswordResendDto.otpId);
    }


    async forgotPasswordConfirm(forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        const user = await this.oneTimePasswordService.confirm(
            forgotPasswordConfirmDto.otpId,
            forgotPasswordConfirmDto.otpCode,
        );

        const uniqueId = randomUUID();

        const entity = new ForgotPassword();
        entity.uniqueId = uniqueId;
        entity.user = user;
        entity.createdAt = new Date();
        await this.repository.save(entity);

        return { uniqueId };
    }


    async forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        const entity = await this.repository.findOneBy({ uniqueId: forgotPasswordChangeDto.uniqueId });
        if (!entity)
        {
            throw new NotFoundException(`${ForgotPassword.name} not found`);
        }

        entity.user.password = await this.hashingService.hash(forgotPasswordChangeDto.password);
        entity.user.marks.active = true;
        await this.usersService.repository.save(entity.user);

        entity.completed = true;
        await this.repository.save(entity);
    }
}
