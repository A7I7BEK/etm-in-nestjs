import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { UsersModule } from 'src/users/users.module';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Role ]),
        OrganizationsModule,
        PermissionsModule,
        forwardRef(() => UsersModule), // BINGO
    ],
    exports: [ RolesService ],
    controllers: [ RolesController ],
    providers: [ RolesService ],
})
export class RolesModule { }
