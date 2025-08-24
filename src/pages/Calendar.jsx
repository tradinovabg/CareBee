import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/* ---------- helpers ---------- */

// безопасное чтение из localStorage
const load = (k, def) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : def;
  } catch {
    return def;
  }
};

// локальная дата YYYY-MM-DD (без UTC-сдвига)
const todayISO = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const parseISODate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const addDays = (isoDate, n) => {
  const d = parseISODate(isoDate);
  d.setDate(d.getDate() + n);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/* ---------- component ---------- */

export default function Calendar() {
  const { t } = useTranslation();

  // режим: день / неделя / месяц
  const [mode, setMode] = useState('day'); // 'day' | 'week' | 'month'

  // фильтры
  const [showVisits, setShowVisits] = useState(true);
  const [showMeds, setShowMeds] = useState(true);

  // исходные данные
  const [visits, setVisits] = useState(() => load('carebee.visits', []));
  const [meds, setMeds] = useState(() => load('carebee.meds', []));

  // подтягиваем обновления из других вкладок
  useEffect(() => {
    const handler = () => {
      setVisits(load('carebee.visits', []));
      setMeds(load('carebee.meds', []));
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const today = todayISO();
  const isToday = (iso) => iso === today;
  const rangeDays = mode === 'day' ? 1 : mode === 'week' ? 7 : 30;

  // массив дат от today на нужный диапазон
  const days = useMemo(() => {
    return Array.from({ length: rangeDays }, (_, i) => addDays(today, i));
  }, [today, rangeDays]);

  // сгруппированные события по датам
  const eventsByDate = useMemo(() => {
    const res = Object.fromEntries(days.map((d) => [d, []]));
    const end = addDays(today, rangeDays - 1);

    if (showVisits) {
      visits.forEach((v) => {
        // ожидаем: { doctor, date, time, place, notes }
        if (v?.date && v.date >= today && v.date <= end && res[v.date]) {
          res[v.date].push({
            time: v.time || '',
            title: v.doctor || '',
            type: 'visit',
            location: v.place || '',
            notes: v.notes || '',
          });
        }
      });
    }

    if (showMeds) {
      meds.forEach((m) => {
        // once:  { mode:'once',  name, once:{date, time} }
        // daily: { mode:'daily', name, daily:{ start?, end?, times:['08:00','20:00'] } }
        if (m?.mode === 'once') {
          const d = m.once?.date;
          if (d && d >= today && d <= end && res[d]) {
            res[d].push({
              time: m.once.time || '',
              title: m.name || '',
              type: 'med',
            });
          }
        } else if (m?.mode === 'daily') {
          const d = m.daily || {};
          days.forEach((day) => {
            const within =
              (!d.start || day >= d.start) &&
              (!d.end || day <= d.end);
            if (within && Array.isArray(d.times)) {
              d.times.forEach((t) => {
                res[day].push({
                  time: t || '',
                  title: m.name || '',
                  type: 'med',
                });
              });
            }
          });
        }
      });
    }

    // сортировка по времени (пустые в конец)
    Object.values(res).forEach((list) =>
      list.sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
    );

    return res;
  }, [days, visits, meds, showVisits, showMeds, today, rangeDays]);

  return (
    <div className="container">
      <h1>{t('calendar.title', 'Calendar')}</h1>

      {/* переключатели режимов */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          className={mode === 'day' ? 'btn btn-primary' : 'btn'}
          onClick={() => setMode('day')}
        >
          {t('calendar.day', 'Day')}
        </button>
        <button
          className={mode === 'week' ? 'btn btn-primary' : 'btn'}
          onClick={() => setMode('week')}
        >
          {t('calendar.week', 'Week')}
        </button>
        <button
          className={mode === 'month' ? 'btn btn-primary' : 'btn'}
          onClick={() => setMode('month')}
        >
          {t('calendar.month', 'Month')}
        </button>
      </div>

      {/* фильтры */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={showVisits}
            onChange={(e) => setShowVisits(e.target.checked)}
          />{' '}
          {t('calendar.showVisits', 'Visits & Events')}
        </label>
        <label>
          <input
            type="checkbox"
            checked={showMeds}
            onChange={(e) => setShowMeds(e.target.checked)}
          />{' '}
          {t('calendar.showMeds', 'Meds schedule')}
        </label>
      </div>

      {/* список дней */}
      <div style={{ display: 'grid', gap: 12 }}>
        {days.map((d) => {
          const list = eventsByDate[d] || [];
          return (
            <section
              key={d}
              className={`day-cell${isToday(d) ? ' is-today' : ''}`}
              aria-current={isToday(d) ? 'date' : undefined}
            >
              <div className="card">
                <strong>
                  {d}{' '}
                  {isToday(d) && (
                    <span className="today-pill">
                      {t('calendar.today', 'Today')}
                    </span>
                  )}
                </strong>

                {list.length ? (
                  <ul>
                    {list.map((e, i) => (
                      <li key={`${d}-${i}`}>
                        {e.time ? `${e.time} ` : ''}
                        {e.title}{' '}
                        (
                        {e.type === 'visit'
                          ? t('calendar.visit', 'Visit')
                          : t('calendar.med', 'Med')}
                        )
                        {e.location ? ` — ${e.location}` : ''}
                        {e.notes ? (
                          <div style={{ color: '#555' }}>{e.notes}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>{t('calendar.empty', 'Nothing scheduled')}</div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
