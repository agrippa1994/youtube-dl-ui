import { AppService } from './app.service';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { DownloadDto } from './dto/download.dto';

@Resolver()
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query((returns) => String)
  getData() {
    return 'hi';
  }

  @Mutation((returns) => Boolean)
  startDownload(
    @Args({ name: 'url' }) url: string,
    @Args({ name: 'id' }) id: string
  ) {
    this.appService.download(url, id);
    return true;
  }

  @Subscription((returns) => DownloadDto, {
    filter: (payload, variables) => {
      return payload.download.id === variables.id;
    },
  })
  download(@Args({ name: 'id' }) id: string) {
    return this.appService.subscribe();
  }
}
