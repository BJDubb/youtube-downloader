import formidable, { IncomingForm } from 'formidable';

export default async function Modify(req, res) {
  
    const data = await new Promise<formidable.File>(function (resolve, reject) {
        const form = new IncomingForm({ keepExtensions: true });
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err);
            resolve({ files });
        });
    });

    console.log(data)
    
    
    res.send("ok")

    // }
    // else {
        // res.status(400).send("Video not found")
    // }
    // console.log(json)
}

export const config = {
  api: {
    bodyParser: false,
  },
};




