import ytdl from 'ytdl-core'
import { NextResponse } from 'next/server';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
import ffmpeg from 'fluent-ffmpeg';
ffmpeg.setFfmpegPath(ffmpegPath);

type PageParams = {
    params: {
        id: string
    }
}

export async function GET(request: Request, { params }: PageParams) {

    const videoId = params.id

    if (!ytdl.validateID(videoId))
        return Response.json({ "error": "Invalid video id provided" }, { status: 400 })

    const ytStream = ytdl("http://www.youtube.com/watch?v=" + videoId, { filter: 'audioonly' })

    const stream = ffmpeg(ytStream)
        .audioCodec('libmp3lame')
        .audioBitrate(128)
        .format('mp3')
        .on('error', (err: any) => console.error(err))
        .on('end', () => console.log('Finished!'))
        .pipe()

    return new NextResponse(stream as unknown as BodyInit)
}