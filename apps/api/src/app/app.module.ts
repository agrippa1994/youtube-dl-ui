import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './constants';
import { AppController } from './app.controller';
import { UpdaterService } from './updater.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      exclude: ['/graphql', '/downloads'],
      rootPath: path.join(process.cwd(), 'dist', 'apps', 'youtube-dl'),
    }),
  ],
  providers: [
    { provide: PUB_SUB, useValue: new PubSub() },
    AppResolver,
    AppService,
    UpdaterService,
  ],
  controllers: [AppController],
})
export class AppModule {}
