import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import {
  useDownloadSubscription,
  useStartDownloadMutation,
} from './operations/operations';

export function Downloader({ id }) {
  const [downloads, setDownloads] = useState([]);
  const [url, setUrl] = useState('');

  const { data } = useDownloadSubscription({ variables: { id } });
  const [startDownload] = useStartDownloadMutation();

  useEffect(() => {
    if (!data || !data.download) return;

    const newDownloads = [...downloads];
    for (const download of newDownloads) {
      if (download.url === data.download.url) {
        download.status = data.download.type;
        if (typeof data.download.progress === 'number') {
          download.progress = data.download.progress;
        }

        if (typeof data.download.file === 'string') {
          download.file = data.download.file;
        }
      }
    }
    setDownloads(newDownloads);
  }, [data]);

  async function download() {
    for (const download of downloads) {
      if (download.url === url) {
        return;
      }
    }

    try {
      await startDownload({
        variables: {
          id,
          url,
        },
      });
      const newDownloads = [...downloads];
      newDownloads.push({ url, status: 'pending', progress: 0, file: null });
      setDownloads(newDownloads);
    } catch (e) {
      console.error('error', e);
    }
  }

  return (
    <>
      <Card>
        <CardHeader title={'Download'} />
        <CardContent>
          <TextField
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            label="Youtube URL"
            placeholder={'Paste Youtube Link'}
            fullWidth
          />
        </CardContent>
        <CardActions>
          <Button onClick={async () => await download()}>Download</Button>
        </CardActions>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {downloads.map((download) => (
              <TableRow key={download.url}>
                <TableCell>{download.url}</TableCell>
                <TableCell>{download.status}</TableCell>
                <TableCell>
                  <LinearProgress
                    value={download.progress}
                    variant={
                      download.status === 'download' ||
                      download.status === 'complete' ||
                      download.status === 'error'
                        ? 'determinate'
                        : 'indeterminate'
                    }
                  />
                </TableCell>
                <TableCell>
                  {download.file && (
                    <a href={`/downloads/${download.file}`}>Download</a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
