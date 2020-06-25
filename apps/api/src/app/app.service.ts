import { Inject, Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './constants';
import { Observable } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';
import { spawn } from 'child_process';

@Injectable()
export class AppService {
  constructor(@Inject(PUB_SUB) private readonly pubSub: PubSub) {}

  subscribe() {
    return this.pubSub.asyncIterator('download');
  }

  download(url: string, id: string) {
    let errorEncountered = false;
    this.startDownload(url).subscribe({
      next: async (data) => {
        await this.pubSub.publish('download', {
          download: { url, id, ...data },
        });
      },

      error: async (e) => {
        errorEncountered = true;
        await this.pubSub.publish('download', {
          download: { url, id, type: 'error' },
        });
      },

      complete: async () => {
        if (errorEncountered) return;
        await this.pubSub.publish('download', {
          download: { url, id, type: 'complete' },
        });
      },
    });
  }

  private startDownload(url: string): Observable<any> {
    return new Observable((subscriber) => {
      let ytdl;
      const id = uuid.v4();
      const dir = path.join(process.cwd(), 'downloads', id);
      try {
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) {
            Logger.error(
              'Error while creating directory',
              `${err}`,
              'AppService'
            );
            subscriber.error(err);
            subscriber.complete();
            return;
          }

          ytdl = spawn(
            'youtube-dl',
            [
              '-x', // extract audio
              '--audio-format',
              'mp3', // extract as mp3
              '--audio-quality',
              '0', // best quality
              '-o',
              '%(title)s.%(ext)s', // output format
              // '--embed-thumbnail', // use thumbnail as cover
              '--ignore-errors', // continue downloading if playlist item does not exist
              '--add-metadata',
              '--metadata-from-title',
              '(?P<artist>.+?) - (?P<title>.+)', // extract title and try to use it as meta data
              '-v', // more verbose
              url,
            ],
            { cwd: dir }
          );
          ytdl.stdout.on('data', (data) => {
            for (const str of data.toString().split('\r')) {
              if (!str) {
                continue;
              }
              Logger.debug(`stdout ${str}`, 'AppService');

              let match;
              if ((match = str.match(/\[download]\s+(\d+)/))) {
                subscriber.next({
                  type: 'download',
                  progress: parseInt(match[1]),
                });
                return;
              }

              if ((match = str.match(/\[ffmpeg\]/))) {
                subscriber.next({ type: 'convert' });
              }
            }
          });

          ytdl.stderr.on('data', (data) => {
            Logger.debug(`stderr ${data.toString()}`, 'AppService');
          });

          ytdl.on('exit', (exit) => {
            Logger.debug(`exit ${exit}`, 'AppService');
            if (exit !== 0) {
              subscriber.error('Execution failed');
              subscriber.complete();
              return;
            }
            subscriber.next({
              type: 'file',
              file: id,
            });
            subscriber.complete();
          });
        });
      } catch (e) {
        subscriber.error(e);
        subscriber.complete();
      }

      return () => {
        if (ytdl && ytdl.exitCode === null) {
          Logger.warn(`killing downloader ...`, 'AppService');
          ytdl.kill();
        }
      };
    });
  }
}
