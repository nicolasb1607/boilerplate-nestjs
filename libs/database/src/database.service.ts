import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private readonly em: EntityManager) { }

  async onModuleInit() {
    await this.enableVectorExtension();
  }

  public async enableVectorExtension(): Promise<void> {
    const conn = await this.em.getConnection();

    await conn.execute('CREATE EXTENSION IF NOT EXISTS vector');
  }
}
