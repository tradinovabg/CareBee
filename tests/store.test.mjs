import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createStore } from '../lib/store.mjs';

test('task lifecycle and profile survive reopening the database', () => {
 const dir = mkdtempSync(join(tmpdir(), 'carebee-test-'));
 let store = createStore(dir);
 try {
  assert.equal(store.read().tasks.length, 3);
  const task = { title: '  Привезти продукты  ', date: '2026-11-10', time: '12:30', assignee: 'anna', category: 'Покупки', notes: 'Хлеб' };
  const added = store.update({ action: 'createTask', task }).tasks.at(-1);
  assert.equal(added.title, 'Привезти продукты');
  assert.equal(added.done, false);
  store.update({ action: 'toggleTask', id: added.id, done: true });
  const profile = { name: 'Тестовый профиль', age: '75', phone: '+33 000', address: 'Демо', needs: 'Позвонить заранее' };
  store.update({ action: 'updateProfile', profile });
  store.close(); store = createStore(dir);
  assert.equal(store.read().tasks.length, 4);
  assert.equal(store.read().tasks.find(t => t.id === added.id).done, true);
  assert.deepEqual(store.read().profile, profile);
  assert.equal(store.update({ action: 'toggleTask', id: added.id, done: false }).tasks.find(t => t.id === added.id).done, false);
 } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
test('rejects invalid mutations without altering saved state', () => {
 const dir = mkdtempSync(join(tmpdir(), 'carebee-test-')); const store = createStore(dir);
 try {
  const original = store.read();
  for (const input of [null, {}, { action: 'createTask', task: {} }, { action: 'toggleTask', id: 'missing', done: true }, { action: 'updateProfile', profile: { name: '' } }]) assert.throws(() => store.update(input));
  assert.deepEqual(store.read(), original);
 } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('editing and deletion preserve other tasks and persist', () => {
 const dir = mkdtempSync(join(tmpdir(), 'carebee-edit-')); let store = createStore(dir);
 try {
  const original = store.read(); const task = original.tasks[0];
  const fields = { ...task, title: 'Новое название', date: '2026-12-31', time: '19:00', assignee: 'anna', category: 'Быт', notes: 'Подробности', repeat: 'weekly', done: true, id: 'forged' };
  const edited = store.update({ action: 'updateTask', id: task.id, task: fields }).tasks[0];
  assert.equal(edited.id, task.id); assert.equal(edited.done, false); assert.equal(edited.title, 'Новое название'); assert.equal(edited.repeat, 'weekly');
  assert.deepEqual(store.read().tasks.slice(1), original.tasks.slice(1));
  store.close(); store = createStore(dir); assert.equal(store.read().tasks[0].title, 'Новое название');
  store.update({ action: 'deleteTask', id: task.id });
  store.close(); store = createStore(dir); assert.deepEqual(store.read().tasks, original.tasks.slice(1));
 } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('recurrence crosses calendar boundaries without duplicate successors on retry or undo', () => {
 const dir = mkdtempSync(join(tmpdir(), 'carebee-repeat-')); let store = createStore(dir);
 try {
  for (const [repeat, date, expected] of [['daily','2028-02-28','2028-02-29'],['daily','2028-02-29','2028-03-01'],['weekly','2026-12-28','2027-01-04']]) {
   const task = store.update({ action: 'createTask', task: { title: 'Регулярное дело', date, time: '09:00', assignee: 'you', category: 'Забота', notes: '', repeat } }).tasks.at(-1);
   const before = store.read().tasks.length;
   const completed = store.update({ action: 'toggleTask', id: task.id, done: true });
   const next = completed.tasks.at(-1); assert.equal(next.date, expected); assert.equal(next.repeat, repeat); assert.equal(next.done, false); assert.notEqual(next.id, task.id);
   store.update({ action: 'toggleTask', id: task.id, done: true });
   store.update({ action: 'toggleTask', id: task.id, done: false });
   store.close(); store = createStore(dir);
   store.update({ action: 'toggleTask', id: task.id, done: true });
   assert.equal(store.read().tasks.length, before + 1);
   store.update({ action: 'deleteTask', id: next.id });
   store.update({ action: 'toggleTask', id: task.id, done: false });
   store.update({ action: 'toggleTask', id: task.id, done: true });
   assert.equal(store.read().tasks.length, before);
  }
 } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});

test('invalid dates, repeat values and missing IDs leave the database unchanged', () => {
 const dir = mkdtempSync(join(tmpdir(), 'carebee-invalid-')); const store = createStore(dir);
 try {
  const original = store.read(); const task = original.tasks[0];
  for (const fields of [{ date: '2026-02-30' }, { repeat: 'unknown' }, { title: '  ' }, { assignee: 'missing' }, { time: '24:00' }]) {
   for (const action of ['createTask', 'updateTask']) assert.throws(() => store.update({ action, id: task.id, task: { ...task, ...fields } }));
  }
  for (const action of ['updateTask', 'deleteTask']) assert.throws(() => store.update({ action, id: 'missing', task }));
  assert.deepEqual(store.read(), original);
 } finally { store.close(); rmSync(dir, { recursive: true, force: true }); }
});
