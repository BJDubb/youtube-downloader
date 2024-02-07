/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import ID3Writer from 'browser-id3-writer';

export default function TagModal({ open, setOpen, audioBlob, setAudioBlob, imageArrayBuffer, setImageArrayBuffer, songInfo, setSongInfo }) {

    const setCoverImage = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                setImageArrayBuffer(reader.result);
            };
            reader.onerror = function () {
                console.error('Reader error', reader.error);
            };
            reader.readAsArrayBuffer(file);
        }
    }

    const saveFile = async() => {
        const buffer = await audioBlob.arrayBuffer()
        const writer = new ID3Writer(buffer);

        if (imageArrayBuffer != null) {
            writer.setFrame('TIT2', songInfo.title) // title
                .setFrame('TPE1', new Array(songInfo.artist)) //artists
                .setFrame('TALB', songInfo.album) //album
                .setFrame('APIC', {
                    type: 3,
                    data: imageArrayBuffer,
                    description: ''
                });
        }
        else {
            writer.setFrame('TIT2', songInfo.title) // title
                .setFrame('TPE1', new Array(songInfo.artist)) //artists
                .setFrame('TALB', songInfo.album) //album
        }
        
        writer.addTag();

        const blob = writer.getBlob();
        setAudioBlob(blob)
    }
    
    const arrayBufferToBase64 =( buffer ) => {
        var binary = '';
        var bytes = new Uint8Array( buffer );
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode( bytes[ i ] );
        }
        return window.btoa( binary );
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
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="title"
                                id="title"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Title"
                                defaultValue={songInfo.title}
                                onChange={(e) => setSongInfo(Object.assign(songInfo, { title: e.target.value}))}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="artist" className="block text-sm font-medium text-gray-700">
                                Artist
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="artist"
                                id="artist"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Artist"
                                defaultValue={songInfo.artist}
                                onChange={(e) => setSongInfo(Object.assign(songInfo, { artist: e.target.value}))}
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="album" className="block text-sm font-medium text-gray-700">
                                Album
                            </label>
                            <div className="mt-1">
                                <input
                                type="text"
                                name="album"
                                id="album"
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                placeholder="Album"
                                defaultValue={songInfo.album}
                                onChange={(e) => setSongInfo(Object.assign(songInfo, { album: e.target.value}))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center justify-center">
                        <div className="bg-[#282828] group hover:bg-neutral-700 cursor-pointer flex justify-center items-center w-52 h-52" onClick={() => document.getElementById("imageInput").click()}>
                            {
                                imageArrayBuffer == null ? 
                                (
                                    <>
                                        <svg role="img" height="83" width="83" viewBox="0 0 16 16" className="Svg-sc-1bi12j5-0 hDgDGI"><path fill="none" d="M16 0v16H0V0z"></path><path d="M14.25 4.162L9.005 1.134l.007 9.372a2.475 2.475 0 00-1.493-.507 2.503 2.503 0 00-2.5 2.5c0 1.379 1.122 2.5 2.5 2.5s2.5-1.121 2.5-2.5l-.013-9.632 3.744 2.162.5-.867zm-6.731 9.836c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5z"></path>
                                        </svg>
                                        <span className="absolute hidden group-hover:block group-hover:text-gray-300">Upload Image...</span>
                                    </>
                                ) :
                                (
                                    <>
                                        <img src={("data:image/jpg;base64, " + arrayBufferToBase64(imageArrayBuffer))} alt="" />
                                    </>
                                )
                            }
                            <input className="hidden" type="file" id="imageInput" onChange={(e) => setCoverImage(e)}/>
                        </div>
                        
                    </div>
                    {/* <p className="text-sm text-gray-500">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                    </p> */}
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
