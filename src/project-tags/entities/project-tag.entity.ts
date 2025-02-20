import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectTag
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    color: string;

    @ManyToOne(type => Project, a => a.tags, { onDelete: 'CASCADE' })
    project: Project;
}
