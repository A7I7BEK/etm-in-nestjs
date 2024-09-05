import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckListGroupsModule } from './check-list-groups/check-list-groups.module';
import appConfig from './common/config/app.config';
import { EmployeesModule } from './employees/employees.module';
import { GroupsModule } from './groups/groups.module';
import { IamModule } from './iam/iam.module';
import { MailModule } from './mail/mail.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportsModule } from './reports/reports.module';
import { ResourceModule } from './resource/resource.module';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
            {
                const isProduction = appConfig().application.nodeEnv === appConfig().production;

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
        EmployeesModule,
        MailModule,
        RolesModule,
        PermissionsModule,
        GroupsModule,
        ProjectsModule,
        TasksModule,
        CheckListGroupsModule,
        ReportsModule,
    ],
})
export class AppModule { }
