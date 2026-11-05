import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const members = [
  { id: 'you', name: 'Вы', role: 'Организатор', initials: 'ВЫ', color: 'green' },
  { id: 'anna', name: 'Анна', role: 'Дочь', initials: 'АК', color: 'peach' },
  { id: 'mikhail', name: 'Михаил', role: 'Сын', initials: 'МК', color: 'blue' },
];
const repeats = ['none', 'daily', 'weekly'];
function taskFields(task) {
  const date = typeof task?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.date) ? new Date(task.date + 'T12:00:00Z') : null;
  if (!task || typeof task.title !== 'string' || !task.title.trim() || task.title.length > 160 || !date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== task.date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(task.time) || !members.some(m => m.id === task.assignee) || !['Забота', 'Покупки', 'Здоровье', 'Быт', 'Общение'].includes(task.category) || typeof task.notes !== 'string' || task.notes.length > 2000 || !repeats.includes(task.repeat ?? 'none')) throw new Error('Проверьте поля задачи');
  return { title: task.title.trim(), date: task.date, time: task.time, assignee: task.assignee, category: task.category, notes: task.notes.trim(), repeat: task.repeat ?? 'none' };
}
function nextDate(date, repeat) {
  const next = new Date(date + 'T12:00:00Z');
  next.setUTCDate(next.getUTCDate() + (repeat === 'weekly' ? 7 : 1));
  if (next.getUTCFullYear() > 9999) throw new Error('Дата следующей задачи выходит за допустимый диапазон');
  return next.toISOString().slice(0, 10);
}
export function createStore(directory = process.env.CAREBEE_DATA_DIR || join(process.cwd(), 'data')) {
  mkdirSync(directory, { recursive: true });
  const db = new DatabaseSync(join(directory, 'carebee.sqlite'));
  db.exec('CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY CHECK (id = 1), value TEXT NOT NULL)');
  if (!db.prepare('SELECT id FROM state WHERE id = 1').get()) {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
    const initial = { profile: { name: 'Елена Константиновна', age: '72', phone: '', address: '', needs: 'Любит прогулки в парке и чай с мятой. При визите заранее позвоните.' }, members, tasks: [
      { id: randomUUID(), title: 'Купить продукты на неделю', date: today, time: '10:00', assignee: 'you', category: 'Покупки', notes: 'Овощи, фрукты, молоко и любимый чай.', done: false },
      { id: randomUUID(), title: 'Прогуляться в парке', date: today, time: '14:00', assignee: 'anna', category: 'Забота', notes: '', done: false },
      { id: randomUUID(), title: 'Позвонить и узнать, как дела', date: today, time: '18:30', assignee: 'mikhail', category: 'Общение', notes: '', done: true },
    ] };
    db.prepare('INSERT INTO state (id, value) VALUES (1, ?)').run(JSON.stringify(initial));
  }
  const read = () => JSON.parse(db.prepare('SELECT value FROM state WHERE id = 1').get().value);
  const write = (state) => db.prepare('UPDATE state SET value = ? WHERE id = 1').run(JSON.stringify(state));
  return {
    read,
    update(input) {
      if (!input || typeof input !== 'object') throw new Error('Некорректный запрос');
      db.exec('BEGIN IMMEDIATE');
      try {
      const state = read();
      if (input.action === 'createTask') {
        state.tasks.push({ ...taskFields(input.task), id: randomUUID(), done: false });
      } else if (input.action === 'updateTask') {
        const task = state.tasks.find(t => t.id === input.id);
        if (!task) throw new Error('Задача не найдена');
        Object.assign(task, taskFields(input.task));
      } else if (input.action === 'deleteTask') {
        if (!state.tasks.some(t => t.id === input.id)) throw new Error('Задача не найдена');
        state.tasks = state.tasks.filter(t => t.id !== input.id);
      } else if (input.action === 'toggleTask') {
        const task = state.tasks.find(t => t.id === input.id);
        if (!task || typeof input.done !== 'boolean') throw new Error('Задача не найдена');
        if (input.done && !task.done && task.repeat && task.repeat !== 'none' && !task.nextCreated) {
          state.tasks.push({ ...taskFields(task), id: randomUUID(), date: nextDate(task.date, task.repeat), done: false });
          task.nextCreated = true;
        }
        task.done = input.done;
      } else if (input.action === 'updateProfile') {
        const p = input.profile;
        if (!p || !['name', 'age', 'phone', 'address', 'needs'].every(key => typeof p[key] === 'string' && p[key].length <= (key === 'needs' ? 2000 : 200)) || !p.name.trim() || (p.age && (!/^\d{1,3}$/.test(p.age) || Number(p.age) > 120))) throw new Error('Проверьте данные профиля');
        state.profile = Object.fromEntries(['name', 'age', 'phone', 'address', 'needs'].map(key => [key, p[key].trim()]));
      } else throw new Error('Неизвестное действие');
      write(state);
      db.exec('COMMIT');
      return state;
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    },
    close: () => db.close(),
  };
}
