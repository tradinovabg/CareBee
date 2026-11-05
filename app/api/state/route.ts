export async function GET() {
  return Response.json({ error: 'Серверное хранение отключено. Дневник хранится только в браузере устройства.' }, { status: 410 });
}
export const POST = GET;
