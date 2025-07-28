import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/mongodb.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to db function

app.get('/', (req, res)=>res.send("API Working"));


app.listen(PORT, ()=>{
    console.log(`Server running at Port ${PORT}`);
    connectDB()
})