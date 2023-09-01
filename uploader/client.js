const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const clearLine = async (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        })

    })
}

const moveCursor = async (dx, dy) => {
    new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        })
    })
}

console.log()

const socket = net.createConnection({ port: '8000', host: '127.0.0.1' }, async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    console.log(fileName, filePath);
    // const filePath = path.join(__dirname, 'file.txt')
    const fileHandle = await fs.open(filePath, 'r')
    const fileReadStream = fileHandle.createReadStream();
    const fileSize = (await fs.stat(filePath)).size;

    let uploadedPercentage = 0;
    let bytesUploaded = 0;

    socket.write(`fileanme: ${fileName}-------`)

    fileReadStream.on('data', async (data) => {
        if (!socket.write(data)) {
            fileReadStream.pause();
        }
        bytesUploaded += data.length;

        let newPercentage = Math.floor((bytesUploaded / fileSize) * 100)
        if (newPercentage % 5 === 0 && newPercentage !== uploadedPercentage) {
            uploadedPercentage = newPercentage;
            await moveCursor(0, -1)
            await clearLine(0)
            console.log(`Uploading... ${uploadedPercentage}`);
        }
    })

    socket.on('drain', () => {
        fileReadStream.resume();
    })
    fileReadStream.on('end', () => {
        console.log('file was successully uploaded');
        socket.end()
    })
});


