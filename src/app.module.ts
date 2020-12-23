import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { ConfigService } from './shared/config.service';
import { EnvironmentMap } from './environment-map';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [ SharedModule ],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => {
        const ssl = config.get(EnvironmentMap.useSSL) === 'true'
          ? { rejectUnauthorized: false }
          : false;

        const url = config.get(EnvironmentMap.pgUrl) ?? '';

        return {
          type: 'postgres',
          entities: [ __dirname + '/**/**.model{.ts,.js}' ],
          url, ssl,
          extra: { max: 5 },
        };
      },
    }),
    AccountModule,
  ],
})
export class AppModule {}
