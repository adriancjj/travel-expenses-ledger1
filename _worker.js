const JSON_HEADERS={
  'content-type':'application/json; charset=utf-8',
  'cache-control':'no-store',
  'x-content-type-options':'nosniff'
};

function json(data,status=200,extraHeaders={}){
  return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...extraHeaders}});
}

function safeEqual(left,right){
  const a=new TextEncoder().encode(left);
  const b=new TextEncoder().encode(right);
  let difference=a.length^b.length;
  const length=Math.max(a.length,b.length);
  for(let index=0;index<length;index++)difference|=(a[index%a.length]||0)^(b[index%b.length]||0);
  return difference===0;
}

function authorized(request,password){
  const header=request.headers.get('authorization')||'';
  return Boolean(password)&&header.startsWith('Bearer ')&&safeEqual(header.slice(7),password);
}

function validState(state){
  return state&&typeof state==='object'&&!Array.isArray(state)&&
    Array.isArray(state.payments)&&Array.isArray(state.trips)&&Array.isArray(state.settlements)&&
    state.currencies&&typeof state.currencies==='object'&&!Array.isArray(state.currencies);
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/schema.sql'||url.pathname==='/CLOUDFLARE-SETUP.md')return new Response('Not found',{status:404});
    if(url.pathname!=='/api/state')return env.ASSETS.fetch(request);

    if(!env.DB)return json({error:'The D1 binding DB is not configured.'},503);
    if(!env.APP_PASSWORD)return json({error:'The APP_PASSWORD secret is not configured.'},503);
    if(!authorized(request,env.APP_PASSWORD))return json({error:'Incorrect or missing access password.'},401,{'www-authenticate':'Bearer'});

    try{
      if(request.method==='GET'){
        const row=await env.DB.prepare('SELECT data, updated_at FROM app_state WHERE id = 1').first();
        return json({state:row?JSON.parse(row.data):null,updatedAt:row?.updated_at||null});
      }

      if(request.method==='PUT'){
        const length=Number(request.headers.get('content-length')||0);
        if(length>1_000_000)return json({error:'Saved data is too large.'},413);
        const body=await request.json();
        if(!validState(body.state))return json({error:'Invalid ledger data.'},400);
        const data=JSON.stringify(body.state);
        if(data.length>1_000_000)return json({error:'Saved data is too large.'},413);
        await env.DB.prepare(`INSERT INTO app_state (id,data,updated_at)
          VALUES (1,?,CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=CURRENT_TIMESTAMP`).bind(data).run();
        return json({ok:true});
      }

      return json({error:'Method not allowed.'},405,{allow:'GET, PUT'});
    }catch(error){
      console.error('Ledger API error',error);
      return json({error:'Cloud storage request failed.'},500);
    }
  }
};
