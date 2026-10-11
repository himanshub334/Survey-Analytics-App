import express from 'express';
import cors from 'cors';
import { Survey, Response } from './models.js';
import { validateSurvey, validateAnswers } from './validation.js';
import { buildAnalytics } from './analytics.js';
import { invalidateSurvey } from './cache.js';
export function createApp() {
 const app=express(); app.use(cors({origin:process.env.CLIENT_ORIGIN?.split(',') ?? true})); app.use(express.json({limit:'1mb'}));
 app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
 app.get('/api/surveys',async(_req,res,next)=>{try{const items=await Survey.find().sort({createdAt:-1}).limit(100).select('title description createdAt').lean();res.json(items);}catch(e){next(e);}});
 app.post('/api/surveys',async(req,res,next)=>{try{const errors=validateSurvey(req.body);if(errors.length)return res.status(400).json({errors});const survey=await Survey.create({title:req.body.title.trim(),description:req.body.description??'',questions:req.body.questions});res.status(201).json(survey);}catch(e){next(e);}});
 app.get('/api/surveys/:id',async(req,res,next)=>{try{const survey=await Survey.findById(req.params.id);if(!survey)return res.status(404).json({error:'Survey not found.'});res.json(survey);}catch(e){if(e.name==='CastError')return res.status(400).json({error:'Invalid survey ID.'});next(e);}});
 app.post('/api/surveys/:id/responses',async(req,res,next)=>{try{const survey=await Survey.findById(req.params.id);if(!survey)return res.status(404).json({error:'Survey not found.'});const errors=validateAnswers(survey,req.body.answers);if(errors.length)return res.status(400).json({errors});const response=await Response.create({surveyId:survey._id,answers:req.body.answers});await invalidateSurvey(survey._id);res.status(201).json({id:response._id,submittedAt:response.submittedAt});}catch(e){if(e.name==='CastError')return res.status(400).json({error:'Invalid survey ID.'});next(e);}});
 app.get('/api/surveys/:id/analytics',async(req,res,next)=>{try{const survey=await Survey.findById(req.params.id);if(!survey)return res.status(404).json({error:'Survey not found.'});res.json(await buildAnalytics(survey));}catch(e){if(e.name==='CastError')return res.status(400).json({error:'Invalid survey ID.'});next(e);}});
 app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:'Internal server error.'});}); return app;
}
