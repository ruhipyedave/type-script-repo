import App from "./app";
import * as http from "http";
const port = process.env.PORT || 3002;

export const server = http.createServer(App);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    const bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires access.`);
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(`${bind} is in use.`);
            process.exit(1);
            break;

        default:
            throw error;
    }
}

function onListening(): void {
    const addr = server.address();
    const bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}