const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const PORT = 8000;

const server = net.createServer(() => { });


server.on('connection', (socket) => {
    console.log('new connection');
    let fileHandle;
    let fileWriteStream;
    socket.on('data', async (data) => {
        if (!fileHandle) {

            socket.pause();

            const indexOfDivider = data.indexOf("-------");
            const fileName = data.subarray(10, indexOfDivider).toString('utf-8')

            const filePath = path.join(__dirname, 'storage', fileName);
            fileHandle = await fs.open(filePath, 'w');

            socket.resume();

            fileWriteStream = fileHandle.createWriteStream();

            fileWriteStream.write(data.subarray(indexOfDivider + 7));

            fileWriteStream.on('drain', () => {
                socket.resume();
            });

        } else {
            if (!fileWriteStream.write(data)) {
                socket.pause()
            }
        }


    })


    socket.on('end', () => {

        fileHandle.close();
        // socket.end();
        fileHandle = null;
        fileWriteStream = null;
        console.log('socket ended');

    })
})


server.listen(PORT, () => {
    console.log(`uploader server listening on ${PORT}`);
})