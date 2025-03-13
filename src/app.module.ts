import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import { ActionsModule } from './actions/actions.module';
import { AppService } from './app.service';
import { CheckListGroupsModule } from './check-list-groups/check-list-groups.module';
import { CheckListItemsModule } from './check-list-items/check-list-items.module';
import appConfig from './common/config/app.config';
import { EmployeesModule } from './employees/employees.module';
import { GroupsModule } from './groups/groups.module';
import { IamModule } from './iam/iam.module';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OneTimePasswordModule } from './one-time-password/one-time-password.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { Permission } from './permissions/entities/permission.entity';
import { PermissionsModule } from './permissions/permissions.module';
import { ProjectColumnsModule } from './project-columns/project-columns.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { ProjectTagsModule } from './project-tags/project-tags.module';
import { ProjectsModule } from './projects/projects.module';
import { RedisStorageModule } from './redis-storage/redis-storage.module';
import { ReportsModule } from './reports/reports.module';
import { ResourceModule } from './resource/resource.module';
import { RolesModule } from './roles/roles.module';
import { ShareModule } from './share/share.module';
import { TaskAttachmentsModule } from './task-attachments/task-attachments.module';
import { TaskCommentsModule } from './task-comments/task-comments.module';
import { TaskDeadlineModule } from './task-deadline/task-deadline.module';
import { TaskMembersModule } from './task-members/task-members.module';
import { TaskTagsModule } from './task-tags/task-tags.module';
import { TaskTimerModule } from './task-timer/task-timer.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';


/**
 * BINGO: now environment variables in .env file
 * can reference themselves making compound variables
 * - There is no need for ConfigModule.forRoot() in imports
 * - Use this or ConfigModule.forRoot()
 */
dotenvExpand.expand(dotenv.config());


@Module({
    imports: [
        // ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
            {
                const isProduction = appConfig().application.nodeEnv === appConfig().application.nodeEnvProd;

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
        ProjectColumnsModule,
        ProjectMembersModule,
        ProjectTagsModule,
        TasksModule,
        TaskMembersModule,
        TaskTagsModule,
        TaskCommentsModule,
        TaskDeadlineModule,
        TaskAttachmentsModule,
        TaskTimerModule,
        CheckListGroupsModule,
        CheckListItemsModule,
        ShareModule,
        ActionsModule,
        NotificationsModule,
        ReportsModule,
        OneTimePasswordModule,
        RedisStorageModule,
    ],
    providers: [
        AppService,
    ],
})
export class AppModule { }
