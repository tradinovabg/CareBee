import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteEntry, exportDiary, parseEntries, readEntries, saveEntry, STORAGE_KEY } from '../lib/diary.mjs';
function storage() { const map = new Map(); return { getItem: key => map.get(key) ?? null, setItem: (key,value) => map.set(key,value) }; }
const first='2026-11-05T09:00:00.000Z';
const later='2026-11-05T10:00:00.000Z';
test('explicit save, reload, newest first, edits keep original date, deletion and export', () => {
 const browser=storage(); assert.deepEqual(readEntries(browser), []);
 let entries=saveEntry(browser,{text:'  Вымышленная запись: чувствует себя хорошо.  '},first);
 const id=entries[0].id; assert.equal(entries[0].text,'Вымышленная запись: чувствует себя хорошо.');
 entries=saveEntry(browser,{text:'Другая запись\nС новой строкой.'},later);
 assert.equal(readEntries(browser)[0].createdAt,later); assert.equal(readEntries(browser).length,2);
 entries=saveEntry(browser,{id,text:'Исправлено: отдыхает.',expectedUpdatedAt:first},'2026-11-05T11:00:00.000Z');
 assert.equal(entries[1].createdAt,first); assert.equal(entries[1].text,'Исправлено: отдыхает.');
 const exported=exportDiary(readEntries(browser));
 assert.ok(exported.includes('Другая запись\nС новой строкой.')); assert.ok(exported.includes('Исправлено: отдыхает.')); assert.ok(exported.includes('Изменено:')); assert.ok(exported.includes('2026')); assert.ok(exported.indexOf('Другая запись')<exported.indexOf('Исправлено'));
 assert.equal(deleteEntry(browser,id,entries[1].updatedAt).length,1); assert.equal(readEntries(browser).length,1);
});
test('invalid, corrupted and inaccessible storage is never silently overwritten', () => {
 const browser=storage();
 for(const text of ['', '  ', 'a'.repeat(20001)]) assert.throws(()=>saveEntry(browser,{text}));
 browser.setItem(STORAGE_KEY,'broken'); assert.throws(()=>saveEntry(browser,{text:'Новая'})); assert.equal(browser.getItem(STORAGE_KEY),'broken');
 for (const raw of ['{}','[{}]','[{"id":1}]']) assert.throws(()=>parseEntries(raw));
 const blocked={getItem(){return null},setItem(){throw new DOMException('blocked','QuotaExceededError')}};
 assert.throws(()=>saveEntry(blocked,{text:'Не терять'}),{name:'QuotaExceededError'});
});
test('other tabs cannot silently overwrite or delete an edited record', () => {
 const browser=storage();const entry=saveEntry(browser,{text:'Исходный текст'},first)[0];
 saveEntry(browser,{id:entry.id,text:'Из другой вкладки',expectedUpdatedAt:first},later);
 assert.throws(()=>saveEntry(browser,{id:entry.id,text:'Устаревшее изменение',expectedUpdatedAt:first}));
 assert.throws(()=>deleteEntry(browser,entry.id,first));
 assert.equal(readEntries(browser)[0].text,'Из другой вкладки');
 const fresh=readEntries(browser)[0];deleteEntry(browser,fresh.id,fresh.updatedAt);
 assert.throws(()=>saveEntry(browser,{id:entry.id,text:'Возвращаем удалённое',expectedUpdatedAt:first}));
});
