import ytdl from 'ytdl-core';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  
  const response = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=" + req.query.id)
  let json = await response.json()
  const dl = ytdl("http://www.youtube.com/watch?v=" + req.query.id, { filter: 'audioandvideo', quality: 'highestvideo' })
  res.setHeader('Content-Disposition', `attachment; filename="${json.items[0].snippet.title}.mp4"`);
  dl.pipe(res)
}
