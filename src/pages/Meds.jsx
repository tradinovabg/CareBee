import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch { return def }
};

export default function Meds() {
  const { t } = useTranslation();
  const meds = useMemo(() => load("carebee.meds", []), []);

  return (
    <div className="container">
      <h1>{t("meds.title","Medications")}</h1>
      {!meds.length ? (
        <p className="text-gray-500">{t("meds.empty","No medications added yet")}</p>
      ) : (
        <ul className="list-disc pl-6">
          {meds.map((m, i) => (
            <li key={i} className="mb-2">
              <strong>{m.name}</strong>{" "}
              {m.mode === "once" ? (
                <span>— {t("meds.mode_once","Once")}: {m.once?.date} {m.once?.time}</span>
              ) : (
                <span>
                  — {t("meds.mode_daily","Daily")}:
                  {" "}{(m.daily?.times || []).join(", ")}
                  {m.daily?.start ? ` · ${m.daily.start}` : ""}{m.daily?.end ? `–${m.daily.end}` : ""}
                </span>
              )}
              {m.dose ? <> · {t("meds.dose","Dose")}: {m.dose}</> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
