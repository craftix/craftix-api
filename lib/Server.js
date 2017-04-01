let net = require('net');

class Server
{
    constructor(port, handler, errHandler, closeHandler)
    {
        this.socket = new net.connect({
            port: port,
            host: '127.0.0.1'
        }, this.onOpen.bind(this));

        this.socket.on('data', this.onMessage.bind(this));
        this.socket.on('close', this.onClose.bind(this));

        this.handler = handler;
        this.errHandler = errHandler;
        this.closeHandler = closeHandler;
    }

    onOpen()
    {
        console.log('Connection opened to craftix://' + this.socket.address().address + ':' + this.socket.localPort);
        console.log('Craftix initialized');
    }

    command(command, params)
    {
        this.socket.write(JSON.stringify({
            command: command,
            params: params
        }) + '\n');
    }

    onMessage(message)
    {
        let parsed = JSON.parse(message.toString());

        if (parsed.error !== undefined)
        {
            this.errHandler(parsed.error, parsed.message);
        }
        else
        {
            this.handler(parsed);
        }
    }

    onClose()
    {
        console.error('Server stopped !');
        this.closeHandler();
    }
}

module.exports = Server;