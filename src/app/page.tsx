"use client"

import TagsModal from "./components/TagsModal";
import { useState } from "react";
import { useFilePicker } from "use-file-picker";
import { FileAmountLimitValidator, FileSizeValidator, FileTypeValidator } from "use-file-picker/validators";
import { PencilSquareIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

type SongInfo = { title: string; artist: string; album: string };

export default function Home() {

    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [imageData, setImageData] = useState<ArrayBuffer | null>(null);
    const [outputBlob, setOutputBlob] = useState<Blob | undefined>();
    const [showTagModal, setShowTagModal] = useState(false);
    const [songInfo, setSongInfo] = useState<SongInfo>({ title: "", artist: "", album: "" });
    const [fileName, setFileName] = useState("");

    const { openFilePicker } = useFilePicker({
        readAs: 'ArrayBuffer',
        accept: '.mp3',
        multiple: false,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['mp3']),
            new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 }),
        ],
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            const file = plainFiles[0];
            const baseName = file.name.replace(/\.mp3$/i, '');
            setFileName(baseName);
            setSongInfo({ title: baseName, artist: "", album: "" });
            setImageData(null);

            const reader = new FileReader();
            reader.onload = function () {
                if (!reader.result || typeof reader.result === 'string') return;
                const blob = new Blob([reader.result], { type: 'audio/mpeg' });
                setAudioBlob(blob);
                setOutputBlob(blob);
            };
            reader.readAsArrayBuffer(file);
        },
    });

    const saveAs = (blob: Blob | undefined, filename: string) => {
        if (!blob) return;
        const a = document.createElement('a');
        a.download = filename;
        a.href = URL.createObjectURL(blob);
        a.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
        });
        a.click();
    };

    const arrayBufferToBase64 = (buf: ArrayBuffer) => {
        return Buffer.from(buf).toString('base64');
    };

    const uploaded = audioBlob !== null;

    return (
        <main className="h-screen flex justify-center items-center bg-gray-50">
            {uploaded && (
                <TagsModal
                    open={showTagModal}
                    setOpen={setShowTagModal}
                    audioBlob={audioBlob}
                    imageData={imageData}
                    setImageData={setImageData}
                    songInfo={songInfo}
                    setSongInfo={setSongInfo}
                    setOutputBlob={setOutputBlob}
                />
            )}

            <div className="flex gap-12">

                {/* Upload panel */}
                <div className="flex flex-col justify-center items-center bg-white p-10 rounded-md shadow-md gap-6">
                    <h1 className="text-black text-xl font-semibold">Upload MP3</h1>
                    <div
                        className="bg-[#282828] group hover:bg-neutral-700 cursor-pointer flex flex-col justify-center items-center w-52 h-52 overflow-hidden gap-2"
                        onClick={() => openFilePicker()}
                    >
                        {uploaded ? (
                            <div className="text-center px-4">
                                <svg role="img" height="48" width="48" viewBox="0 0 16 16" className="mx-auto mb-2">
                                    <path fill="none" d="M16 0v16H0V0z" />
                                    <path fill="#818cf8" d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z" />
                                </svg>
                                <p className="text-white text-sm break-all line-clamp-3">{fileName}</p>
                            </div>
                        ) : (
                            <>
                                <svg role="img" height="83" width="83" viewBox="0 0 16 16">
                                    <path fill="none" d="M16 0v16H0V0z" />
                                    <path fill="white" d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z" />
                                </svg>
                                <span className="text-gray-400 text-sm group-hover:text-gray-300">Upload MP3 File...</span>
                            </>
                        )}
                    </div>
                    {uploaded && (
                        <button
                            type="button"
                            onClick={() => openFilePicker()}
                            className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Change file
                        </button>
                    )}
                </div>

                {/* Actions panel */}
                {uploaded && (
                    <div className="flex items-center justify-center bg-white p-10 rounded-md shadow-md">
                        <div className="flex flex-col gap-4">
                            <button
                                type="button"
                                onClick={() => setShowTagModal(true)}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Modify Tags
                                <PencilSquareIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => saveAs(outputBlob, `${songInfo.title || fileName}.mp3`)}
                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Download
                                <ArrowDownTrayIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Preview panel */}
                {uploaded && (
                    <div className="flex flex-col justify-center items-center bg-white p-10 rounded-md shadow-md text-center">
                        <div className="bg-[#282828] flex justify-center items-center w-52 h-52 overflow-hidden">
                            {imageData == null ? (
                                <svg role="img" height="83" width="83" viewBox="0 0 16 16">
                                    <path fill="none" d="M16 0v16H0V0z" />
                                    <path fill="white" d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z" />
                                </svg>
                            ) : (
                                <Image src={"data:image/jpg;base64," + arrayBufferToBase64(imageData)} width={256} height={256} alt={songInfo.title} />
                            )}
                        </div>
                        <h2 className="mt-2 text-black font-medium">{songInfo.title || fileName}</h2>
                        {(songInfo.artist || songInfo.album) && (
                            <h2 className="text-gray-500 text-sm">
                                {`${songInfo.artist}${songInfo.artist && songInfo.album ? ' - ' : ''}${songInfo.album}`}
                            </h2>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}
