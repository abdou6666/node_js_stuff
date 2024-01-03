import express from "express";
const server = express();
const PORT = 8080;



server.use(express.json());

let requestCount = 0;

server.get('/test', (req, res) => {
    requestCount++;
    console.log('____________________________');
    console.log(`Request Count : ${requestCount}\n`);
    console.log(`Request Query : ${req.query}\n`);
    return res.status(200).json({ count: requestCount });
});


server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});

