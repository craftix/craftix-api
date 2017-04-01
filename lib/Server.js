let net = require('net');

class Server
{
    constructor(port, handler, errHandler, closeHandler)
    {
        this.socket = new net.Socket();
        this.socket.connect(port, '127.0.0.1', this.onOpen);

        this.socket.on('data', this.onMessage);
        this.socket.on('close', this.onClose);

        this.handler = handler;
        this.errHandler = errHandler;
        this.closeHandler = closeHandler;
    }

    private onOpen()
    {
        console.log('Connection opened to craftix://' + this.socket.address() + ':' + this.socket.port);
        console.log('Craftix initialized');
    }

    sendMessage(message)
    {
        this.socket.write(message);
    }

    private onMessage(message)
    {
        let parsed = JSON.parse(message);

        if (parsed.error !== undefined)
        {
            this.errHandler(parsed.error, parsed.message);
        }
        else if (parsed.success === undefined)
        {
            this.handler(parsed);
        }
    }

    private onClose()
    {
        console.err('Server stopped !');
        this.closeHandler();
    }
}

module.exports = Server;