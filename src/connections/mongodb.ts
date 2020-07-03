
const environment = process.env.NODE_ENV || "local";
import mongoose from "mongoose";
const connectionString = process.env.MONGO_URL + process.env.MONGO_DB;

const uri = "mongodb+srv://admin:<password>@cluster0.ktlxi.mongodb.net/<dbname>?retryWrites=true&w=majority";
if (environment === "notusing") {
    mongoose
        .connect(connectionString, {
            auth: {
                user: process.env.MONGO_USERNAME,
                password: process.env.MONGO_PWD
            },
            useNewUrlParser: true
        })
        .then(res => console.log("Database connected ... "))
        .catch((error) => {
            console.error(error);
            return process.exit();
        });
}
else {
    mongoose.connect(connectionString, { poolSize: 10, bufferMaxEntries: 0, reconnectTries: 5000, useNewUrlParser: true, useUnifiedTopology: true })
        .then(res => console.log("Database connected ... "))
        .catch((error) => {
            console.error(error);
            return process.exit();
        });
}