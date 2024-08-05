import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesModule } from './coffees/coffees.module';
import { IamModule } from './iam/iam.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ ConfigModule ],
            inject: [ ConfigService ],
            useFactory: async (configService: ConfigService) =>
            {
                const isProduction = configService.get('NODE_ENV') === 'production';

                return {
                    ssl: isProduction,
                    extra: {
                        ssl: isProduction ? { rejectUnauthorized: false } : null
                    },
                    type: 'postgres',
                    autoLoadEntities: true,
                    synchronize: !isProduction,
                    host: configService.get('DATABASE_HOST'),
                    port: configService.get('DATABASE_PORT'),
                    database: configService.get('DATABASE_NAME'),
                    username: configService.get('DATABASE_USERNAME'),
                    password: configService.get('DATABASE_PASSWORD'),
                };
            },
        }),
        IamModule,
        UsersModule,
        CoffeesModule,
    ],
})
export class AppModule { }
