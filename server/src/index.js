import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import { connectCache } from './cache.js';
const port=process.env.PORT||4000;
try { await mongoose.connect(process.env.MONGODB_URI||'mongodb://127.0.0.1:27017/survey_analytics'); console.log('MongoDB connected'); }
catch(err){ console.error('MongoDB connection failed:',err.message); process.exit(1); }
await connectCache(process.env.REDIS_URL);
createApp().listen(port,()=>console.log(`Survey Analytics API listening on ${port}`));
