import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to db function
await connectDB();
await connectCloudinary()
// middlewares
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res)=>res.send("API Working"));
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use('/api/educator',express.json(), educatorRouter)
app.use('/api/course',express.json(), courseRouter);


app.listen(PORT, ()=>{
    console.log(`Server running at Port ${PORT}`);
})