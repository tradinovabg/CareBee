import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const load = (k, def) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def } catch { return def }
};

export default function Visits() {
  const { t } = useTranslation();
  const visits = useMemo(() => load("carebee.visits", []), []);

  return (
    <div className="container">
      <h1>{t("visits.title","Visits & Events")}</h1>
      {!visits.length ? (
        <p className="text-gray-500">{t("visits.empty","No visits yet")}</p>
      ) : (
        <ul className="list-disc pl-6">
          {visits.map((v, i) => (
            <li key={i} className="mb-2">
              <strong>{v.date} {v.time || ""}</strong>{" "}
              — {t("visits.doctor","Doctor")}: {v.doctor || "—"}
              {v.place ? ` · ${t("visits.place","Place")}: ${v.place}` : ""}
              {v.notes ? <div className="text-gray-600">{t("visits.notes","Notes")}: {v.notes}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
