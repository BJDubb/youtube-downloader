import fetch from 'node-fetch';

export default async function Details(req, res) {
  
    // var options = {
    //     'method': 'GET',
    //     'hostname': 'youtube.googleapis.com',
    //     'path': '/youtube/v3/videos?part=snippet%252CcontentDetails%252Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=' + req.query.id,
    // };

    // var req = https.request(options, function (res) {

    // res.on("data", function (chunk) {
    //     chunks.push(chunk);
    // });

    // res.on("end", function (chunk) {
    //     var body = Buffer.concat(chunks);
    //     console.log(body.toString());
    // });

    // res.on("error", function (error) {
    //     console.error(error);
    //     });
    // });

    // req.end();
    // console.log(req.query.id)
    const response = await fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&key=AIzaSyCVlwT0OyyYi7tuQPQx96sgD3-sm4_fJts&id=" + req.query.id)
    let json = await response.json()
    
    if (json.items[0] != null) {
        let result = {
            url: "www.youtube.com/watch?v=" + req.query.id,
            title: json.items[0].snippet.title,
            description: json.items[0].snippet.description,
            img: json.items[0].snippet.thumbnails.high.url,
        }
        res.send(result)

    }
    else {
        res.status(400).send("Video not found")
    }
    // console.log(json)
}


