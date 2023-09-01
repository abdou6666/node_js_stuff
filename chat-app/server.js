const net = require("net");

const PORT = 8000
const server = net.createServer()



server.listen(PORT, '127.0.0.1', () => {
    console.log("Opened server on : ", server.address());

})

const clients = []
server.on('connection', (socket) => {
    // console.log('User connected : ', { socket });

    const socketId = clients.length + 1;

    for (let connectedClient of clients) {
        connectedClient.socket.write(`User ${socketId} joined`)
    }

    socket.write(`id-${socketId}`)
    clients.push({ id: socketId.toString(), socket, });

    socket.on('data', (data) => {
        // console.log('user send this data : ', data.toString('utf-8'));
        const dataString = data.toString('utf-8');
        const id = dataString.substring(0, dataString.indexOf('-'))
        const message = dataString.substring(dataString.indexOf("-message-") + 9)

        for (let connectedClient of clients) {
            connectedClient.socket.write(`> User ${id}: ${message}`)
        }

    })

    socket.on('end', () => {
        for (let connectedClient of clients) {
            connectedClient.socket.write(`User ${socketId} left`)
        }

    })
})
server.on('close', () => {
    console.log('client left');
    // sockets.filter(socket => socket)
})