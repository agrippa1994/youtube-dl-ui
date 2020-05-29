import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import 'express-zip';

@Controller('downloads')
export class AppController {
  @Get(':id')
  download(@Param('id') id: string, @Res() res: Response & { zip: any }) {
    fs.readdir(path.join(process.cwd(), 'downloads', id), (err, files) => {
      if (err || files.length === 0) {
        res.status(HttpStatus.NOT_FOUND).end();
        return;
      }

      if (files.length === 1) {
        res.download(path.join(process.cwd(), 'downloads', id, files[0]));
      } else {
        res.zip(
          files.map((f) => ({
            path: path.join(process.cwd(), 'downloads', id, f),
            name: f,
          })),
          'downloads.zip'
        );
      }
    });
  }
}
