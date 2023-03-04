import mongoose from "mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";

async function connect() {
    const mongoDB = await MongoMemoryServer.create();
    const getUri = mongoDB.getUri();

    mongoose.set('strictQuery', true);
    const db = await mongoose.connect('mongodb+srv://sarthak:1HkHPRhajekMGYHb@cluster0.cr10zfc.mongodb.net/?retryWrites=true&w=majority');
    console.log("Database Connected!")

    return db;
}

export default connect;