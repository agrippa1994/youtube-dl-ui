import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';
import { environment } from '../environments/environment';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UpdaterService implements OnModuleInit {
  @Cron('* */30 * * * *')
  async onModuleInit() {
    if (!environment.production) {
      Logger.debug('Skipping update - not on production system');
      return;
    }

    try {
      Logger.debug('Fetching latest youtube-dl');
      await this.execAndLog(
        'curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/bin/youtube-dl'
      );
      await this.execAndLog('chmod +x /usr/bin/youtube-dl');
    } catch (e) {
      Logger.error('Error while updating youtube-dl', `${e}`, 'UpdaterService');
    }
  }

  private async execAndLog(command: string) {
    const { stdout, stderr } = await this.exec(
      'curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/bin/youtube-dl'
    );
    if (stdout) {
      Logger.debug(stdout, 'UpdaterService');
    }
    if (stderr) {
      Logger.warn(stderr, 'UpdaterService');
    }
  }
  private get exec() {
    return util.promisify(exec);
  }
}
