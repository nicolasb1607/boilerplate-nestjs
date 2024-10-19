import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule, MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConfigModule } from '@app/config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MikroOrmModuleOptions<PostgreSqlDriver>> => {
        const isSSL = configService.get<boolean>('SSL_CONNECTION');
        let driverOptions: any = undefined;

        if (isSSL == true) {
          driverOptions = {
            connection: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          };
        }

        return {
          driver: PostgreSqlDriver,
          autoLoadEntities: true,
          discovery: { warnWhenNoEntities: false },
          port: configService.get<number>('DATABASE_PORT'),
          host: configService.get<string>('DATABASE_HOST'),
          dbName: configService.get<string>('DATABASE_NAME'),
          user: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          driverOptions,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
