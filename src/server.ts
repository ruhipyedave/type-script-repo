import App from "./app";
import * as http from "http";
import { convertToNumber } from "./utils/index";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("env", process.env.DB_HOST)
const port = convertToNumber(process.env.PORT || 3002);
const connectionString: string = process.env.DB_HOST + process.env.DB_NAME;

export const server = http.createServer(App);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log("Database connected ... "))
    .catch((error) => {
        console.log("connectionString", connectionString);
        console.error(error);
        return process.exit();
    });

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