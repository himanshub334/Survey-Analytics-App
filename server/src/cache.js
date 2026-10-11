import { createClient } from 'redis';
let client;
export async function connectCache(url) {
  if (!url) return null;
  try { const c=createClient({url}); c.on('error',()=>{}); await c.connect(); client=c; return c; }
  catch { client=null; return null; }
}
export function getCache(){return client;}
export async function invalidateSurvey(id){try{if(client) await client.del(`analytics:${id}`);}catch{/* cache is best-effort */}}
