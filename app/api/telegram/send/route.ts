import { handle,telegram } from '../../../../lib/telegram-http';
export const runtime='nodejs';
export async function POST(request:Request){return handle(request,(body,ip)=>telegram.send({chatId:body.chatId,telegramKey:body.telegramKey,text:body.text,requestId:body.requestId,test:body.test===true},ip));}
