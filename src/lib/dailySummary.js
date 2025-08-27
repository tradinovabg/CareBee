// src/lib/dailySummary.js — clean minimal implementation

const SETTINGS_KEY = "carebee.autoSend.settings";
const LAST_KEY = "carebee.autoSend.lastSummaryAt";

const load = (k, def) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

export function getAutoSendSettings() {
  // enabled: включена ли автопересылка; time: HH:MM
  return load(SETTINGS_KEY, { enabled: false, time: "08:00" });
}

export function setAutoSendSettings(next) {
  const current = getAutoSendSettings();
  save(SETTINGS_KEY, { ...current, ...next });
}

export function getLastSummaryAt() {
  return load(LAST_KEY, null); // ISO‑строка или null
}

export async function sendDailySummaryNow() {
  // Заглушка отправки: просто фиксируем время
  const nowIso = new Date().toISOString();
  save(LAST_KEY, nowIso);
  return { ok: true, at: nowIso };
}

function todayAt(timeHHMM) {
  const [hh = 0, mm = 0] = (timeHHMM || "00:00").split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
}

function sameLocalDate(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function shouldAutoSend(now = new Date()) {
  const { enabled, time } = getAutoSendSettings();
  if (!enabled) return false;

  const last = getLastSummaryAt();
  const lastDate = last ? new Date(last) : null;

  const target = todayAt(time);
  const isTimePassed = now.getTime() >= target.getTime();

  // если сегодня уже отправляли — не отправляем
  if (lastDate && sameLocalDate(lastDate, now)) return false;

  return isTimePassed;
}

export function maybeSendDailySummary(now = new Date()) {
  if (shouldAutoSend(now)) {
    return sendDailySummaryNow();
  }
  return { skipped: true };
}

