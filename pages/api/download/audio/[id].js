import ytdl from 'ytdl-core';
import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

export default async function handler(req, res) {
  const response = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=" + req.query.id)
  let json = await response.json()
  const id = req.query.id
  if (json.items[0] != null) {
    const stream = ytdl(id, { quality: "highestaudio", dlChunkSize: 0 })

    await ffmpegSync(stream, id, res, json.items[0].snippet.title)
    
  }
  else {
      res.status(400).send("Video not found")
  }
}

function ffmpegSync(stream, id, res, title) {
  return new Promise((resolve, reject) => {
    console.log(`${__dirname}/${id}.mp3`)
    ffmpeg(stream)
      .audioBitrate(128)
      .save(`${__dirname}/${id}.mp3`)
      .on("progress", (p) => {
        console.log(p.targetSize + "kb downloaded");
      })
      .on("end", () => {
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(title)}.mp3"`);
        var readStream = fs.readFileSync(`${__dirname}/${id}.mp3`)
        res.send(readStream)
        resolve()
      })
      .on('error',(err)=>{
        return reject(new Error(err))
      })
  })
}


