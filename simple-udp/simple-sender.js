const dgram = require("dgram");

const sender = dgram.createSocket("udp4");

sender.send("this is a string", 8000, "127.0.0.1", (err, bytes) => {
    console.log({ err });
    console.log({ bytes });
})