import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'src/organizations/entities/organization.entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Role,
            Permission,
            Organization,
        ]),
    ],
    controllers: [ RolesController ],
    providers: [ RolesService ],
})
export class RolesModule { }
