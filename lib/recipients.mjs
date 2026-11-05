export const RECIPIENTS_KEY = 'carebee.recipients.v1';
export const CHANNELS = { whatsapp: { label: 'WhatsApp' }, telegram: { label: 'Telegram' } };
export function normalizePhone(value) {
  if (typeof value !== 'string' || !/^\+[\d\s()-]+$/.test(value.trim())) throw new Error('Укажите международный номер с + и кодом страны, например +33 6 12 34 56 78.');
  const phone = '+' + value.replace(/\D/g, '');
  if (!/^\+[1-9]\d{6,14}$/.test(phone)) throw new Error('Номер должен содержать код страны и от 7 до 15 цифр.');
  return phone;
}
function fields(input) {
  if (!input || typeof input.name !== 'string' || !input.name.trim() || input.name.length > 80 || !Array.isArray(input.aliases) || input.aliases.length > 30 || input.aliases.some(a => typeof a !== 'string' || !a.trim() || a.length > 80) || typeof input.channel !== 'string' || !Object.hasOwn(CHANNELS, input.channel)) throw new Error('Проверьте имя, алиасы и канал получателя.');
  return { name: input.name.trim(), aliases: [...new Set(input.aliases.map(a => a.trim()).filter(Boolean))], phone: normalizePhone(input.phone), channel: input.channel, isDefault: Boolean(input.isDefault), telegramChatId: typeof input.telegramChatId === 'string' ? input.telegramChatId.trim() : '', telegramKey: typeof input.telegramKey === 'string' ? input.telegramKey : '' };
}
export function readRecipients(storage) {
  const raw = storage.getItem(RECIPIENTS_KEY);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.some(p => !p || typeof p.id !== 'string' || !p.id || typeof p.updatedAt !== 'string' || !Number.isFinite(Date.parse(p.updatedAt))) || new Set(data.map(p => p.id)).size !== data.length || data.filter(p => p.isDefault).length > 1) throw new Error('Не удалось прочитать профили получателей. Данные не перезаписаны.');
  return data.map(p => ({ ...p, ...fields(p) }));
}
export function saveRecipient(storage, input) {
  const data = readRecipients(storage); const profile = fields(input);
  const index = data.findIndex(p => p.id === input.id);
  if (input.id && (index < 0 || data[index].updatedAt !== input.expectedUpdatedAt)) throw new Error('Профиль изменён или удалён в другой вкладке. Откройте его заново.');
  const updatedAt = new Date(Math.max(Date.now(), index >= 0 ? Date.parse(data[index].updatedAt) + 1 : 0)).toISOString();
  const saved = { ...profile, id: input.id || crypto.randomUUID(), updatedAt };
  const next = data.map(p => profile.isDefault ? { ...p, isDefault: false } : p);
  if (index >= 0) next[index] = saved; else next.push(saved);
  storage.setItem(RECIPIENTS_KEY, JSON.stringify(next)); return next;
}
export function deleteRecipient(storage, id, expectedUpdatedAt) {
  const data = readRecipients(storage); const old = data.find(p => p.id === id);
  if (old && old.updatedAt !== expectedUpdatedAt) throw new Error('Профиль изменён в другой вкладке. Откройте его заново.');
  const next = data.filter(p => p.id !== id); storage.setItem(RECIPIENTS_KEY, JSON.stringify(next)); return next;
}
export function whatsappLink(profile, text) {
  if (!['whatsapp','telegram'].includes(profile.channel) || typeof text !== 'string' || !text.trim()) throw new Error('Выберите WhatsApp и введите текст.');
  return `https://wa.me/${normalizePhone(profile.phone).slice(1)}?text=${encodeURIComponent(text)}`;
}
function normalized(word) { return word.toLocaleLowerCase('ru-RU').replace(/ё/g, 'е'); }
function stem(word) {
  const value = normalized(word);
  // Conservative suffix matching: no fuzzy prefix search. Irregular names need aliases.
  const base = value.replace(/(?:иями|ями|ами|ией|ием|ьей|ого|ему|ому|ой|ей|ою|ею|ом|ем|ия|ию|ьи|ья|ью|а|я|у|ю|е|ы|и|о|ь|й)$/u, '');
  return base.length >= 2 ? base : value;
}
function tokens(value) { return [...value.matchAll(/[\p{L}\p{M}]+/gu)].map(m => ({ value: normalized(m[0]), start: m.index, end: m.index + m[0].length })); }
export function recognizeRecipient(text, profiles) {
  const words = tokens(text); if (!words.length) return { status: 'none', text };
  const matches = [];
  for (const profile of profiles) for (const alias of [profile.name, ...profile.aliases]) {
    const name = tokens(alias); if (!name.length || name.length > words.length) continue;
    for (const start of new Set([0, words.length - name.length])) {
      const part = words.slice(start, start + name.length);
      if (part.every((w,i) => w.value === name[i].value || stem(w.value) === stem(name[i].value))) {
        const exact = part.every((w,i) => w.value === name[i].value);
        matches.push({ id: profile.id, start: part[0].start, end: part.at(-1).end, edge: start === 0 ? 'start' : 'end', score: name.length * 10 + Number(exact) });
      }
    }
  }
  if (!matches.length) return { status: 'none', text };
  const best = ['start','end'].flatMap(edge => { const found = matches.filter(m => m.edge === edge); const score = Math.max(...found.map(m => m.score)); return found.filter(m => m.score === score); });
  const ids = [...new Set(best.map(m => m.id))];
  if (ids.length !== 1) return { status: 'ambiguous', text, candidates: ids };
  const ranges = best.filter(m => m.id === ids[0]);
  let cleaned = text;
  const end = ranges.filter(m => m.edge === 'end').sort((a,b) => a.start-b.start)[0];
  if (end) cleaned = cleaned.slice(0,end.start).replace(/[\s\p{P}]+$/u,'');
  const start = ranges.filter(m => m.edge === 'start').sort((a,b) => b.end-a.end)[0];
  if (start) cleaned = cleaned.slice(Math.min(start.end,cleaned.length)).replace(/^[\s\p{P}]+/u,'');
  return { status: 'matched', recipientId: ids[0], text: cleaned.trim() };
}
