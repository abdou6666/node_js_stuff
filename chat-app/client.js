const net = require("net");
const readline = require('node:readline/promises');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

let id;

const socket = net.createConnection({ host: '127.0.0.1', port: 8000 }, async () => {

    const ask = async () => {
        const message = await rl.question('Enter a message > ');
        await moveCursor(0, -1)
        await clearLine(0)
        socket.write(`${id}-message-${message}`)

    }

    ask();


    socket.on('data', async (data) => {
        console.log()
        await moveCursor(0, -1)
        await clearLine(0)

        if (data.toString().startsWith('id-')) {
            id = data.toString('utf-8').substring(3)
            console.log(`Your id is ${id}!\n`);
        } else {
            console.log(data.toString("utf-8"));
        }
        ask();

    })

})





socket.on('close', () => {
    console.log('connection was closed (client)');
})

