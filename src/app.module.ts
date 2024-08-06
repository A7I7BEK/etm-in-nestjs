import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ResourceModule } from './resource/resource.module';
import appConfig from './config/app.config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
            {
                const isProduction = appConfig().application.nodeEnv === 'production';

                return {
                    ssl: isProduction,
                    extra: {
                        ssl: isProduction ? { rejectUnauthorized: false } : null
                    },
                    type: 'postgres',
                    autoLoadEntities: true,
                    synchronize: !isProduction,
                    ...appConfig().database
                };
            },
        }),
        IamModule,
        UsersModule,
        OrganizationsModule,
        ResourceModule,
    ],
})
export class AppModule { }
