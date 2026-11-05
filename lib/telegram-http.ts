import { createTelegramService, TelegramError } from './telegram-server.mjs';
export const telegram = createTelegramService();
export function response(data: unknown,status=200) { return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}}); }
export async function handle(request: Request, action: (body: Record<string, unknown>,ip:string)=>Promise<unknown>, webhook=false) {
  try {
    if(!webhook){const origin=request.headers.get('origin');if(!origin || new URL(origin).host!==(request.headers.get('host') || new URL(request.url).host))return response({error:'Запрос с другого сайта запрещён.'},403);}
    const reader=request.body?.getReader();if(!reader)return response({error:'Нет данных запроса.'},400);
    const chunks:Uint8Array[]=[];let size=0;
    while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>40000){await reader.cancel();return response({error:'Запрос слишком большой.'},413);}chunks.push(part.value);}
    const raw=Buffer.concat(chunks).toString('utf8');
    const body=JSON.parse(raw);if(!body || typeof body!=='object' || Array.isArray(body))return response({error:'Некорректный запрос.'},400);
    // Vercel overwrites x-vercel-forwarded-for; arbitrary client headers are not trusted for limits.
    const ip=process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'unknown' : 'local';
    return response(await action(body,ip));
  } catch(e) {if(e instanceof TelegramError)return response({error:e.message,uncertain:e.uncertain},e.status);return response({error:'Сервис Telegram временно недоступен. Используйте WhatsApp.'},503);}
}
