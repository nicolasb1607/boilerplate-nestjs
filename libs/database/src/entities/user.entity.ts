import { AuthenticatedEntity } from '@app/database/entities/abstract/authenticated.entity';
import { UserRepository } from '@app/database/repositories/user.repository';
import { IdentityEnum } from '@app/database/types/user.types';
import { Entity, EntityRepositoryType, Enum, Property } from '@mikro-orm/core';
import { Role } from '@app/auth/enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  tableName: 'user',
  repository: () => UserRepository,
})
export class UserEntity extends AuthenticatedEntity {
  [EntityRepositoryType]?: UserRepository;

  // Base User Properties
  @ApiProperty()
  @Property({ name: 'first_name', type: 'varchar' })
  firstName!: string;

  @ApiProperty()
  @Property({ name: 'last_name', type: 'varchar' })
  lastName!: string;

  @ApiProperty()
  @Property({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @ApiProperty({ enum: IdentityEnum })
  @Enum({ name: 'identity', items: () => IdentityEnum, nullable: true })
  identity?: IdentityEnum;

  @ApiProperty()
  @Property({ name: 'postcode', type: 'varchar', nullable: true })
  postcode?: string;

  @ApiProperty()
  @Property({ name: 'address', type: 'varchar', nullable: true })
  address?: string;

  @ApiProperty()
  @Enum({ name: 'role', items: () => Role, default: Role.User })
  role: Role = Role.User;

  @ApiProperty()
  @Property({ name: 'profile_picture_url', type: 'varchar', nullable: true })
  profilePictureUrl?: string;

  @ApiProperty()
  @Property({ name: 'verified', type: 'bool', default: false })
  verified: boolean = false;
}
