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
import { ForgotPasswordResendDto } from '../dto/forgot-password-resend.dto';
import { ForgotPasswordSendDto } from '../dto/forgot-password-send.dto';
import { ForgotPassword } from '../entities/forgot-password.entity';

@Injectable()
export class ForgotPasswordManager
{
    constructor (
        @InjectRepository(ForgotPassword)
        public readonly repository: Repository<ForgotPassword>,
        @InjectRepository(User)
        private readonly _usersRepository: Repository<User>,
        private readonly _hashingService: HashingService,
        private readonly _oneTimePasswordService: OneTimePasswordService,
    ) { }


    async forgotPasswordSend(forgotPasswordSendDto: ForgotPasswordSendDto)
    {
        const { paramForSendingOtp: contact } = forgotPasswordSendDto;
        const options: Partial<OtpSendingOptions> = {}; // BINGO
        const userFindOptions: FindOptionsWhere<User> = {}; // BINGO

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

        const user = await this._usersRepository.findOneBy(userFindOptions);
        if (!user)
        {
            throw new NotFoundException(`${User.name} not found`);
        }

        const { otpId: id } = await this._oneTimePasswordService.send(user, options);

        return { id };
    }


    async forgotPasswordResend(forgotPasswordResendDto: ForgotPasswordResendDto)
    {
        await this._oneTimePasswordService.resend(forgotPasswordResendDto.otpId);
    }


    async forgotPasswordConfirm(forgotPasswordConfirmDto: ForgotPasswordConfirmDto)
    {
        const user = await this._oneTimePasswordService.confirm(
            forgotPasswordConfirmDto.otpId,
            forgotPasswordConfirmDto.otpCode,
        );

        const uniqueId = randomUUID();

        const entity = new ForgotPassword();
        entity.uniqueId = uniqueId;
        entity.user = user;
        entity.createdAt = Date.now().toString();
        await this.repository.save(entity);

        return { uniqueKey: uniqueId };
    }


    async forgotPasswordChange(forgotPasswordChangeDto: ForgotPasswordChangeDto)
    {
        const entity = await this.repository.findOneBy({ uniqueId: forgotPasswordChangeDto.uniqueKey });
        if (!entity)
        {
            throw new NotFoundException(`${ForgotPassword.name} not found`);
        }

        entity.user.password = await this._hashingService.hash(forgotPasswordChangeDto.password);
        entity.user.marks = USER_MARK_REGISTER_CONFIRMED;
        await this._usersRepository.save(entity.user);

        entity.completed = true;
        await this.repository.save(entity);
    }
}
