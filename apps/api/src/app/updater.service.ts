import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { exec } from 'child_process';
import * as util from 'util';
import { environment } from '../environments/environment';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UpdaterService implements OnModuleInit {
  @Cron('0 */30 * * * *')
  async onModuleInit() {
    if (!environment.production) {
      Logger.debug(
        'Skipping update - not on production system',
        'UpdaterService'
      );
      return;
    }

    try {
      Logger.debug('Fetching latest youtube-dl');
      await this.execAndLog('youtube-dl -U');
    } catch (e) {
      Logger.error('Error while updating youtube-dl', `${e}`, 'UpdaterService');
    }
  }

  private async execAndLog(command: string) {
    const { stdout, stderr } = await this.exec(command);
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
