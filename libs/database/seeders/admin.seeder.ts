import { Role } from '@app/auth/enums/role.enum';
import { UserEntity } from '@app/database';
import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const admin1 = em.upsert(UserEntity, {
      firstName: 'Nicolas',
      lastName: 'Burat de Gurgy',
      email: 'nicolas@state.com',
      password: await bcrypt.hash('adminpsswrd', 10),
      role: Role.Admin,
      verified: true,
    });
    const admin2 = em.upsert(UserEntity, {
      firstName: 'Aurelien',
      lastName: 'Nicolle',
      email: 'aurelien@state.com',
      password: await bcrypt.hash('adminpsswrd', 10),
      role: Role.Admin,
      verified: true,
    });
    const admin3 = em.upsert(UserEntity, {
      firstName: 'Aurelien',
      lastName: 'Nicolle',
      email: 'galina@state.com',
      password: await bcrypt.hash('adminpsswrd', 10),
      role: Role.Admin,
      verified: true,
    });
  }
}
