"use client"
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Image from 'next/image';
import { ID3Writer } from 'browser-id3-writer';
import { useFilePicker } from 'use-file-picker';
import {
    FileAmountLimitValidator,
    FileTypeValidator,
    FileSizeValidator,
    ImageDimensionsValidator,
} from 'use-file-picker/validators';

//test

type SongInfo = { title: string, artist: string, album: string }

type TagsModalProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    audioBlob: Blob,
    imageData: ArrayBuffer | null,
    setImageData: (data: ArrayBuffer | null) => void,
    songInfo: SongInfo,
    setSongInfo: (info: SongInfo) => void,
    setOutputBlob: (blob: Blob | undefined) => void
}

export default function TagsModal({ open, setOpen, audioBlob, imageData, setImageData, songInfo, setSongInfo, setOutputBlob }: TagsModalProps) {

    const { openFilePicker } = useFilePicker({
        readAs: 'ArrayBuffer',
        accept: 'image/*',
        multiple: false,
        validators: [
            new FileAmountLimitValidator({ max: 1 }),
            new FileTypeValidator(['jpg', 'png']),
            new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
            new ImageDimensionsValidator({
                maxHeight: 1024, // in pixels
                maxWidth: 1024,
                minHeight: 128,
                minWidth: 128,
            }),
        ],
        onFilesSuccessfullySelected: ({ plainFiles }) => {
            setCoverImage(plainFiles[0])
        },
    });

    const setCoverImage = (file: File) => {

        const reader = new FileReader();
        reader.onload = function () {
            if (!reader.result) return
            if (typeof reader.result === 'string') return

            setImageData(reader.result);
        };

        reader.onerror = function () {
            console.error('Reader error', reader.error);
        };

        reader.readAsArrayBuffer(file);
    }

    const saveFile = async () => {
        const buffer = await audioBlob.arrayBuffer()

        const writer = new ID3Writer(buffer);

        writer.setFrame('TIT2', songInfo.title) // title
            .setFrame('TPE1', new Array(songInfo.artist)) //artists
            .setFrame('TALB', songInfo.album) //album

        if (imageData != null) {

            writer.setFrame('APIC', {
                type: 3,
                data: imageData,
                description: ''
            });

        }
        writer.addTag()

        const blob = writer.getBlob();

        setOutputBlob(blob)
    }

    const arrayBufferToBase64 = (buf: ArrayBuffer) => {
        return Buffer.from(buf).toString('base64')
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                            <div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        Edit Song Details
                                    </Dialog.Title>
                                    <div className="mt-2 flex p-5">
                                        <div className="w-1/2 text-left">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Title
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="Title"
                                                        value={songInfo.title}
                                                        onChange={(e) => setSongInfo({ ...songInfo, title: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Artist
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="artist"
                                                        id="artist"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        placeholder="Artist"
                                                        value={songInfo.artist}
                                                        onChange={(e) => setSongInfo({ ...songInfo, artist: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                    Album
                                                </label>
                                                <div className="mt-2">
                                                    <input
                                                        type="text"
                                                        name="album"
                                                        id="album"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        value={songInfo.album}
                                                        onChange={(e) => setSongInfo({ ...songInfo, album: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-1/2 flex items-center justify-center">
                                            <div className="bg-[#282828] group hover:bg-neutral-700 cursor-pointer flex justify-center items-center w-52 h-52 overflow-hidden" onClick={() => openFilePicker()}>
                                                {
                                                    imageData == null ?
                                                        (
                                                            <>
                                                                <svg role="img" height="83" width="83" viewBox="0 0 16 16" className="Svg-sc-1bi12j5-0 hDgDGI"><path fill="none" d="M16 0v16H0V0z"></path><path d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z"></path>
                                                                </svg>
                                                                <span className="absolute hidden group-hover:block group-hover:text-gray-300">Upload Image...</span>
                                                            </>
                                                        ) :
                                                        (
                                                            <>
                                                                <Image src={("data:image/jpg;base64, " + arrayBufferToBase64(imageData))} width={256} height={256} alt={songInfo.title} />
                                                            </>
                                                        )
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                    onClick={() => { setOpen(false); saveFile(); }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}