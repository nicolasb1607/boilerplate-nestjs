import { BaseEntity } from '@app/database/entities/abstract/base.entity';
import { Entity, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class AuthenticatedEntity extends BaseEntity {
  @Property({ name: 'email', type: 'varchar', unique: true })
  email!: string;

  @Property({ name: 'password', type: 'varchar', hidden: true, nullable: true })
  password?: string;
}
