export const STORAGE_KEY = 'carebee.diary.v1';
export const MAX_TEXT_LENGTH = 20000;
export function parseEntries(raw) {
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.some(e => !e || typeof e.id !== 'string' || !e.id || typeof e.text !== 'string' || !e.text.trim() || e.text.length > MAX_TEXT_LENGTH || typeof e.createdAt !== 'string' || !Number.isFinite(Date.parse(e.createdAt)) || (e.handoffs !== undefined && (!Array.isArray(e.handoffs) || e.handoffs.some(h => !h || typeof h.recipientName !== 'string' || h.channel !== 'whatsapp' || !Number.isFinite(Date.parse(h.at))))) || typeof e.updatedAt !== 'string' || !Number.isFinite(Date.parse(e.updatedAt))) || new Set(data.map(e => e.id)).size !== data.length) throw new Error('Повреждённые данные дневника');
  return data.sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
}
export function readEntries(storage) { return parseEntries(storage.getItem(STORAGE_KEY)); }
/**
 * @param {any} storage
 * @param {{id?: string, text: string, expectedUpdatedAt?: string, handoff?: {recipientName: string, channel: string, at: string}}} input
 * @param {string} [now]
 */
export function saveEntry(storage, { id, text, expectedUpdatedAt, handoff = undefined }, now = new Date().toISOString()) {
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_TEXT_LENGTH) throw new Error('Введите текст записи (до 20 000 символов).');
  const entries = readEntries(storage);
  if (handoff && (typeof handoff.recipientName !== 'string' || !handoff.recipientName.trim() || handoff.channel !== 'whatsapp' || !Number.isFinite(Date.parse(handoff.at)))) throw new Error('Некорректная отметка отправки');
  if (id) {
    const old = entries.find(e => e.id === id);
    if (!old) throw new Error('Эта запись уже удалена в другой вкладке. Скопируйте текст и создайте новую.');
    if (old.updatedAt !== expectedUpdatedAt) throw new Error('Запись изменена в другой вкладке. Скопируйте свой текст и откройте запись заново.');
    const updatedAt = new Date(Math.max(Date.parse(now), Date.parse(old.updatedAt) + 1)).toISOString();
    entries[entries.indexOf(old)] = { ...old, text: text.trim(), updatedAt, ...(handoff ? { handoffs: [...(old.handoffs || []), handoff] } : {}) };
  } else entries.unshift({ id: globalThis.crypto.randomUUID(), text: text.trim(), createdAt: now, updatedAt: now, ...(handoff ? { handoffs: [handoff] } : {}) });
  storage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return parseEntries(JSON.stringify(entries));
}
export function deleteEntry(storage, id, expectedUpdatedAt) {
  const entries = readEntries(storage);
  const old = entries.find(e => e.id === id);
  if (old && old.updatedAt !== expectedUpdatedAt) throw new Error('Запись изменена в другой вкладке. Откройте её заново перед удалением.');
  const remaining = entries.filter(e => e.id !== id);
  storage.setItem(STORAGE_KEY, JSON.stringify(remaining));
  return remaining;
}
export function formatDate(iso) {
  return new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
export function exportDiary(entries) {
  return 'CareBee — дневник ухода и самочувствия\n' + (entries.length ? '\n' + [...entries].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).map(e => `${formatDate(e.createdAt)}${e.updatedAt !== e.createdAt ? '\nИзменено: ' + formatDate(e.updatedAt) : ''}\n${e.text}${(e.handoffs || []).map(h => `\nОтправлено: ${h.recipientName} · ${formatDate(h.at)} · WhatsApp открыт; отправка и доставка не подтверждены`).join('')}`).join('\n\n────────────────────\n\n') : '\nНет сохранённых записей.') + '\n';
}
