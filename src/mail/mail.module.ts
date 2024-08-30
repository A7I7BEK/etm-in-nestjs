import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import appConfig from 'src/common/config/app.config';
import { MailService } from './mail.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: async () =>
            {
                const isProduction = appConfig().application.nodeEnv === appConfig().production;

                return {
                    transport: {
                        host: appConfig().mail.host,
                        port: appConfig().mail.port,
                        secure: isProduction,
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
                        dir: join(__dirname, 'templates'),
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
    providers: [ MailService ],
})
export class MailModule { }
