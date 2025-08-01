import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';  // ✅ import body-parser
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json()); // for all normal routes

// ✅ Health check
app.get('/', (req, res) => res.send("API Working"));

// ✅ Clerk webhook route (raw body required for Svix verification)
app.post('/clerk', 
    bodyParser.raw({ type: 'application/json' }), 
    clerkWebhooks
);

// ✅ Start server + connect DB
app.listen(PORT, () => {
    console.log(`🚀 Server running at Port ${PORT}`);
    connectDB();
});
