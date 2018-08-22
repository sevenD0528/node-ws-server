const http = require('http')
const fs = require('fs');
const WebSocketServer = require('websocket').server

const httpServer = http.createServer((request, response) => {
    console.log('[' + new Date + '] Received request for ' + request.url)
    response.writeHead(404)
    response.end()
})


// const noneExistFileName = ['async_create.', new Date() - 0, '.txt'].join('');
// fs.writeFile(noneExistFileName, '文件不存在，则创建', function (err) {
//     if (err) throw err;
//     console.log(noneExistFileName + '不存在，被创建了！');
// });

// fs.writeFile('async_exists.txt', '文件已存在，则覆盖内容 -- ' + (new Date() - 0), function (err) {
//     if (err) throw err;
//     console.log('exists.txt已存在，内容被覆盖！');
// });
// fs.writeFile('./audiodata.txt', '文件已存在，则覆盖内容 -- ' + (new Date() - 0));

const wsServer = new WebSocketServer({
    httpServer,
    autoAcceptConnections: true
})

wsServer.on('connect', connection => {
    connection.on('message', message => {
        console.log(message.binaryData);
        if (message.type === 'utf8') {
            console.log('>> message content from client: ' + message.utf8Data)
            connection.sendUTF('[from server] ' + message.utf8Data)
        } else {
            let noneExistFileName = ['audio.', new Date() - 0, '.txt'].join('');
            fs.writeFile(noneExistFileName, message.binaryData, function (err) {
                if (err) throw err;
                console.log(noneExistFileName + '不存在，被创建了！');
            });
            // fs.writeFile('./audiodata.txt', message.binaryData, {
            //     flag: 'a'
            // });
        }
    }).on('close', (reasonCode, description) => {
        console.log('[' + new Date() + '] Peer ' + connection.remoteAddress + ' disconnected.')
    })
})

httpServer.listen(8080, () => {
    console.log('[' + new Date() + '] Serveris listening on port 8080')
})

