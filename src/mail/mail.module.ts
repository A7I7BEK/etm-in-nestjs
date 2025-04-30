import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import * as path from 'path';
import appConfig from 'src/common/config/app.config';
import { MailThrottleService } from './mail-throttle.service';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () =>
            {
                return {
                    transport: {
                        host: appConfig().mail.host,
                        port: appConfig().mail.port,
                        secure: false, // true for 465, false for 587 ports
                        auth: {
                            user: appConfig().mail.user,
                            pass: appConfig().mail.password,
                        },
                    },
                    defaults: {
                        from: {
                            name: appConfig().application.name,
                            address: appConfig().mail.defaultEmail,
                        },
                    },
                    template: {
                        dir: path.posix.join(__dirname, 'templates'),
                        adapter: new HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                };
            },
        }),
    ],
    exports: [ MailService ],
    providers: [
        MailService,
        MailThrottleService,
    ],
})
export class MailModule { }
