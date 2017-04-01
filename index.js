let Server = require('./lib/Server');

const PORT = 6554;
let server;

function _init(port = PORT)
{
    server = new Server(port, handleResponse, handleError, handleClose);
}

function _start()
{

}

function handleResponse(message)
{

}

function handleError(type, message)
{

}

function handleClose()
{

}

module.exports = {
    Server: Server,
    init: _init,
    start: _start
};