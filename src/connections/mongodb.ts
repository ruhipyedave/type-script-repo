
import mongoose from "mongoose";
const connectionString = process.env.MONGO_URL + process.env.MONGO_DB;

mongoose.connect(connectionString, { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log("Database connected ... "))
    .catch((error) => {
        console.error(error);
        return process.exit();
    });