//import mongoose from "mongoose";
import ConnectDB from "./db/index.js";
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

import { app } from "./app.js";


//1st approch
// ; (async () => {
//     try {
//         await mongoose.connect('mongodb://localhost:27017/ChaiandBankend')
//         app.on('error', (error) => {
//             console.log(error);
//             throw error
//         })
//         console.log("Mongodb Connected");
//         app.listen(3001,()=>{console.log('Your BAckend run on port: 3001');})
//     } catch (error) {
//         console.log(error);
//         throw error
//     }
// })()


//2nd approch
ConnectDB()
    .then(app.listen(3001, function () {
        console.log(`Servers are running at 3001`);
    })).catch((err) => { console.log('MongoDB connectin faield', err); })