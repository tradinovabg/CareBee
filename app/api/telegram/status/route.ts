import { handle,telegram } from '../../../../lib/telegram-http';
export const runtime='nodejs';
export async function POST(request:Request){return handle(request,(body,ip)=>telegram.status({code:body.code,pollKey:body.pollKey},ip));}
