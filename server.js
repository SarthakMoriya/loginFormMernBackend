import express from 'express';
import morgan from 'morgan'
import cors from 'cors'

import connect from './database/conn.js'
import router from './router/router.js';

const app = express();

// MIDDLEWARES
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use('/api/v1/',router)


app.get('/', (req, res) => {
    res.send("Lolo")
})

// START SERVER ONLY IF WE HAVE VALID CONNECTION
connect().then(()=>{
    try {
        app.listen(8080, () => { console.log("Server Started!") })
    } catch (error) {
        console.log('Can not connect to server!')
    }
}).catch(error=>{ console.log('Invalid Database Connection! ')})