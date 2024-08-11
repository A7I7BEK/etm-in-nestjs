import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Organization ]),
    ],
    exports: [ OrganizationsService ],
    controllers: [ OrganizationsController ],
    providers: [ OrganizationsService ],
})
export class OrganizationsModule { }
