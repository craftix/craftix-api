let Server = require('./lib/Server');

const PORT = 6544;
let server, state = 'none';

function init(handler = () => {}, errorHandler = () => {}, closeHandler = () => { process.exit(); }, port = PORT)
{
    return server = new Server(port, handler, errorHandler, closeHandler);
}

function start(options, errorHandler, closeHandler)
{
    init((message) => {
        if (state === 'none' && message.status === 'ok')
        {
            auth(options.username, options.password, options.clientToken);
            state = 'auth';
        }
        else if (state === 'auth' && message.accessToken)
        {
            update(options.sUpdateServer);
            state = 'update';
        }
        else if (state === 'update' && message.success === true)
        {
            launch({
                name: options.serverName,
                version: options.mcVersion,
                params: options.launchParams || [],
                vmParams: options.vmParams || [],
                tweaks: options.tweaks || []
            });

            process.exit();
        }
    }, (type, message) => errorHandler(state, type, message), closeHandler);
}

function auth(username, password, clientToken = '')
{
    server.command('authenticate', {
        username: username,
        password: password,
        clientToken: clientToken
    });
}

function update(serverURL)
{
    server.command('update', {
        server: serverURL
    });
}

function launch(options = {})
{
    server.command('launch', options);
}

module.exports = {
    Server: Server,

    init: init,
    start: start,

    auth: auth,
    update: update,
    launch: launch
};