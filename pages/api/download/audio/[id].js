import ytdl from 'ytdl-core';
import fetch from 'node-fetch';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  const response = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=" + req.query.id)
    let json = await response.json()
    
    if (json.items[0] != null) {
        const dl = ytdl("http://www.youtube.com/watch?v=" + req.query.id, { filter: 'audioonly', })
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(json.items[0].snippet.title)}.mp3"`);
        // dl.pipe(res)
        ffmpeg(dl)
          .audioCodec('libmp3lame')
          .audioBitrate(128)
          .format('mp3')
          .on('error', (err) => console.error(err))
          .on('end', () => console.log('Finished!'))
          .pipe(res, {
            end: true
          });
      
    }
    else {
        res.status(400).send("Video not found")
    }
}


