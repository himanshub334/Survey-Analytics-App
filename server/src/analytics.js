import { Response } from './models.js';
import { getCache } from './cache.js';
export async function buildAnalytics(survey) {
  const key=`analytics:${survey._id}`; const cache=getCache();
  if(cache){try{const cached=await cache.get(key); if(cached) return JSON.parse(cached);}catch{}}
  const responses=await Response.find({surveyId:survey._id}).lean();
  const questions=survey.questions.map(q=>{
    const counts={}; for(const option of q.options ?? []) counts[option]=0;
    let answered=0; const textAnswers=[];
    for(const r of responses){const a=r.answers.find(x=>String(x.questionId)===String(q._id)); if(!a || a.value==null || a.value==='') continue; answered++;
      if(q.type==='multiple' && Array.isArray(a.value)) for(const v of a.value) counts[v]=(counts[v]??0)+1;
      else if(q.type==='single') counts[a.value]=(counts[a.value]??0)+1;
      else if(q.type==='text') textAnswers.push(String(a.value));
    }
    return {questionId:String(q._id),text:q.text,type:q.type,answered,counts,textAnswers};
  });
  const result={surveyId:String(survey._id),title:survey.title,responseCount:responses.length,questions};
  if(cache){try{await cache.set(key,JSON.stringify(result),{EX:60});}catch{}}
  return result;
}
