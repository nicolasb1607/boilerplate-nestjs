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
      email: 'nicolasburat1607@gmail.com',
      password: await bcrypt.hash('adminpassword', 10),
      role: Role.Admin,
      verified: true,
    });
  }
}
