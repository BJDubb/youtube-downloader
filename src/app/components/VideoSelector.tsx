"use client"
import { useState } from 'react'
import TagsModal from './TagsModal';
import Image from 'next/image';
import { SpeakerWaveIcon, PencilSquareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';

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

function VideoSelector({ defaultMetadata }: { defaultMetadata: VideoMetadata }) {

    const [metadata, setMetadata] = useState(defaultMetadata)
    const [downloading, setDownloading] = useState(false)
    const [downloaded, setDownloaded] = useState(false)
    const [audioBlob, setAudioBlob] = useState<Blob>(new Blob())
    const [imageData, setImageData] = useState<ArrayBuffer | null>(null)
    const [outputBlob, setOutputBlob] = useState<Blob>()
    const [showTagModal, setShowTagModal] = useState(false)
    const [songInfo, setSongInfo] = useState({ title: metadata.title, artist: "Artist", album: "Album" })

    const downloadAudio = async () => {
        setDownloading(true)
        const res = await fetch("/api/download/audio/" + metadata.id)
        const blob = await res.blob()

        setAudioBlob(blob)
        setOutputBlob(blob)
        setDownloading(false)
        setDownloaded(true)
    }

    const saveAs = (blob: Blob | undefined, filename: string) => {

        if (!blob) {
            console.error('No blob provided')
            return
        }

        const a = document.createElement('a');
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', (e) => {
            setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    }

    const arrayBufferToBase64 = (buf: ArrayBuffer) => {
        return Buffer.from(buf).toString('base64')
    }

    return (
        <main className="h-screen flex justify-center items-center bg-gray-50">
            {downloaded && <TagsModal open={showTagModal} setOpen={setShowTagModal} audioBlob={audioBlob} imageData={imageData} setImageData={setImageData} songInfo={songInfo} setSongInfo={setSongInfo} setOutputBlob={setOutputBlob} />}
            <div className="flex gap-12">

                <div className="flex flex-col justify-center bg-white p-10 rounded-md shadow-md">
                    <h1 className="text-center mb-10 text-black">
                        {metadata.title}
                    </h1>
                    <Image className="max-w-sm" src={metadata.imgInfo.url} width={metadata.imgInfo.width} height={metadata.imgInfo.height} alt={metadata.title} />
                </div>

                <div className="flex items-center justify-center bg-white p-10 rounded-md shadow-md">
                    <div className={`flex flex-col gap-10 ${(downloaded && " hidden")}`}>

                        <button type="button" onClick={() => downloadAudio()} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Download Audio
                            <SpeakerWaveIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                        </button>

                        <div className={"flex justify-center items-center" + (!downloading ? " hidden" : "")}>
                            <div className="animate-spin inline-block w-8 h-8 border-4 rounded-full border-r-4 border-r-black" role="status">
                                <span className="hidden">Loading...</span>
                            </div>
                        </div>
                    </div>

                    <div className={`flex flex-col gap-10 ${(!downloaded && "hidden")}`}>
                        <button type="button" onClick={() => setShowTagModal(true)} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Modify Tags
                            <PencilSquareIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                        </button>

                        <button type="button" onClick={() => saveAs(outputBlob, `${metadata.title}.mp3`)} className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Download
                            <ArrowDownTrayIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>

                </div>

                <div className={`flex flex-col justify-center items-center bg-white p-10 rounded-md shadow-md text-center ${(!downloaded && " hidden")}`}>
                    <div className="bg-[#282828] flex justify-center items-center w-52 h-52 overflow-hidden">
                        {
                            imageData == null ?
                                (
                                    <>
                                        <svg role="img" height="83" width="83" viewBox="0 0 16 16" className="Svg-sc-1bi12j5-0 hDgDGI"><path fill="none" d="M16 0v16H0V0z"></path><path d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z"></path>
                                        </svg>
                                    </>
                                ) :
                                (
                                    <>
                                        <Image src={("data:image/jpg;base64, " + arrayBufferToBase64(imageData))} width={256} height={256} alt={metadata.title} />
                                    </>
                                )
                        }
                    </div>
                    <h2 className="mt-2 text-black">{songInfo.title}</h2>
                    <h2 className='text-black'>{`${songInfo.artist} - ${songInfo.album}`}</h2>
                </div>

            </div>
        </main>
    )
}

export default VideoSelector