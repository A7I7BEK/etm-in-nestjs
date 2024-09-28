import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { CheckListGroupsModule } from './check-list-groups/check-list-groups.module';
import appConfig from './common/config/app.config';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { GroupsModule } from './groups/groups.module';
import { BcryptService } from './iam/hashing/bcrypt.service';
import { HashingService } from './iam/hashing/hashing.service';
import { IamModule } from './iam/iam.module';
import { MailModule } from './mail/mail.module';
import { OneTimePasswordModule } from './one-time-password/one-time-password.module';
import { Organization } from './organizations/entities/organization.entity';
import { OrganizationsModule } from './organizations/organizations.module';
import { Permission } from './permissions/entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportsModule } from './reports/reports.module';
import { ResourceModule } from './resource/resource.module';
import { Role } from './roles/entities/role.entity';
import { RolesModule } from './roles/roles.module';
import { TasksModule } from './tasks/tasks.module';
import { User } from './users/entities/user.entity';
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
        TypeOrmModule.forFeature([
            Organization,
            User,
            Employee,
            Role,
            Permission,
        ]),
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
        OneTimePasswordModule,
    ],
    providers: [
        AppService,
        {
            provide: HashingService,
            useClass: BcryptService,
        },
    ],
})
export class AppModule { }
