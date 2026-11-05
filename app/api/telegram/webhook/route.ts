import { handle,telegram,response } from '../../../../lib/telegram-http';
export const runtime='nodejs';
export async function POST(request:Request){
  // Reject before parsing any message if webhook authentication is absent.
  if(!process.env.TELEGRAM_WEBHOOK_SECRET || request.headers.get('x-telegram-bot-api-secret-token')!==process.env.TELEGRAM_WEBHOOK_SECRET)return response({error:'Доступ запрещён.'},403);
  return handle(request,async body=>{await telegram.webhook(body,request.headers.get('x-telegram-bot-api-secret-token'));return {ok:true};},true);
}
