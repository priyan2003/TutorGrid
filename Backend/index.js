import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import { requireAuth } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// connect to db function
await connectDB();
await connectCloudinary();
// middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://tutor-grid-priyanshu.vercel.app'], // add your deployed domain here
  credentials: true
}));
app.use(clerkMiddleware());

app.get('/', (req, res)=>res.send("API Working"));
app.post('/clerk', express.raw({ type: 'application/json' }), clerkWebhooks);

app.use('/api/educator',express.json(),requireAuth() , educatorRouter)
app.use('/api/course',express.json(), courseRouter);
app.use('/api/user',express.json(), userRouter);
app.post('/stripe',express.raw({ type: 'application/json' }), stripeWebhooks)


app.listen(PORT, ()=>{
    console.log(`Server running at Port ${PORT}`);
})