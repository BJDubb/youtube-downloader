import ID3Writer from 'browser-id3-writer';
import { saveAs } from 'file-saver';
import { useState } from 'react';

export default function Modify() {

    const [songArrayBuffer, setSongArrayBuffer] = useState(new ArrayBuffer())
    const [coverArrayBuffer, setCoverArrayBuffer] = useState(new ArrayBuffer())

    const [title, setTitle] = useState("")
    const [artist, setArtist] = useState("")
    const [album, setAlbum] = useState("")

    const uploadSong = async (e) => {
        const file = e.target.files[0];
        console.log(file)

        const reader = new FileReader();
        reader.onload = function () {
            setSongArrayBuffer(reader.result);
            // go next
        };
        reader.onerror = function () {
            // handle error
            console.error('Reader error', reader.error);
        };
        reader.readAsArrayBuffer(file);
    }

    const uploadImage = async (e) => {
        const file = e.target.files[0];
        console.log(file)

        const reader = new FileReader();
        reader.onload = function () {
            setCoverArrayBuffer(reader.result)
            // go next
        };
        reader.onerror = function () {
            // handle error
            console.error('Reader error', reader.error);
        };
        reader.readAsArrayBuffer(file);
        // const { data } = await axios.post("/api/modify", formData)
    }

    const setTags = () => {
        const writer = new ID3Writer(songArrayBuffer);
        writer.setFrame('TIT2', title) // title
            .setFrame('TPE1', new Array(artist)) //artists
            .setFrame('TALB', album) //album
            .setFrame('APIC', {
                type: 3,
                data: coverArrayBuffer,
                description: ''
            });
        writer.addTag();

        const blob = writer.getBlob();
        saveAs(blob, "Song.mp3")
    }

    return (
        <div>
            <h1>Upload MP3 to modify.</h1>
            <input type="file" onChange={(e) => uploadSong(e)}></input>
            <h1>Upload Image to set as cover art.</h1>
            <input type="file" onChange={(e) => uploadImage(e)}></input>
            <input type="text" onChange={(e) => setTitle(e.target.value || "")} placeholder="Title"></input>
            <input type="text" onChange={(e) => setArtist(e.target.value || "")} placeholder="Artist"></input>
            <input type="text" onChange={(e) => setAlbum(e.target.value || "")} placeholder="Album"></input>
            <button onClick={() => setTags()}>Save Changes</button>
        </div>
    )
}
