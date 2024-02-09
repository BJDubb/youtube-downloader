import Head from 'next/head'
import VideoSelector from '../components/VideoSelector'

type SearchParamsProps = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

type VideoMetadata = {
    id: string
    url: string;
    title: string;
    desc: string;
    imgInfo: {
        url: string;
        width: number;
        height: number;
    };
}

export default async function Home({ params, searchParams }: SearchParamsProps) {

    const videoId = searchParams["v"]
    console.log(videoId)

    const metadata = await GetVideoMetadata(videoId);

    if (!metadata) return <div>Video not found</div>

    return (
        <div>
            <Head>
                <title>Youtube Downloader</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <VideoSelector defaultMetadata={metadata} />

        </div>
    )
}

async function GetVideoMetadata(videoId: string | string[] | undefined): Promise<VideoMetadata | null> {

    if (videoId == undefined) return null

    if (typeof videoId !== "string") videoId = videoId[0]

    const response = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=" + videoId)
    let json = await response.json()

    if (json.items[0] == null) return null

    const url: string = "www.youtube.com/watch?v=" + videoId
    const title: string = json.items[0].snippet.title
    const desc: string = json.items[0].snippet.description
    const imgInfo: { url: string, width: number, height: number } = {
        ...json.items[0].snippet.thumbnails.high
    }
    return {
        id: videoId, url, title, desc, imgInfo
    }
}