import { handle,telegram } from '../../../../lib/telegram-http';
export const runtime='nodejs';
export async function POST(request:Request){return handle(request,(_body,ip)=>telegram.pair(ip));}
