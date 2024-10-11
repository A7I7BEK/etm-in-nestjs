import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { OtpSendingOptions } from 'src/one-time-password/interfaces/otp-sending-options.interface';
import { OneTimePasswordService } from 'src/one-time-password/one-time-password.service';
import { User } from 'src/users/entities/user.entity';
import { USER_MARK_REGISTER_CONFIRMED } from 'src/users/marks/user-mark.constants';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HashingService } from '../../hashing/hashing.service';
import { ForgotPasswordChangeDto } from '../dto/forgot-password-change.dto';
import { ForgotPasswordConfirmDto } from '../dto/forgot-password-confirm.dto';
import { ForgotPasswordSendDto } from '../dto/forgot-password-send.dto';
import { ForgotPassword } from '../entities/forgot-password.entity';

@Injectable()
export class ForgotPasswordManager
{
    constructor (
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(ForgotPassword)
        private readonly forgotPasswordRepository: Repository<ForgotPassword>,
        private readonly hashingService: HashingService,
        private readonly oneTimePasswordService: OneTimePasswordService,
    ) { }

    async forgotPasswordSend(forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        const { paramForSendingOtp: contact } = forgotPasswordSendDto;
        const options: Partial<OtpSendingOptions> = {};
        const userFindOptions: FindOptionsWhere<User> = {};

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

        const user = await this.usersRepository.findOneBy(userFindOptions);
        if (!user)
        {
            throw new NotFoundException();
        }

        const { otpId: id } = await this.oneTimePasswordService.send(user, options);

        return { id };
    }

    async forgotPasswordResend(id: string)
    {
        await this.oneTimePasswordService.resend(id);
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
        entity.createdAt = Date.now().toString();
        await this.forgotPasswordRepository.save(entity);

        return { uniqueKey: uniqueId };
    }

    async forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        const entity = await this.forgotPasswordRepository.findOneBy({ uniqueId: forgotPasswordChangeDto.uniqueKey });
        if (!entity)
        {
            throw new NotFoundException();
        }

        entity.user.password = await this.hashingService.hash(forgotPasswordChangeDto.password);
        entity.user.marks = USER_MARK_REGISTER_CONFIRMED;
        await this.usersRepository.save(entity.user);

        entity.completed = true;
        await this.forgotPasswordRepository.save(entity);
    }
}
