import { telegram,response } from '../../../../lib/telegram-http';
export const dynamic='force-dynamic';
export async function GET(){return response(telegram.config());}
