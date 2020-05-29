import { Module } from '@nestjs/common';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './constants';
import { AppController } from './app.controller';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
    }),
  ],
  providers: [
    { provide: PUB_SUB, useValue: new PubSub() },
    AppResolver,
    AppService,
  ],
  controllers: [AppController],
})
export class AppModule {}
