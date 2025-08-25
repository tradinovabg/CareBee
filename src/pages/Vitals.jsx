import React from "react";
import { useTranslation } from "react-i18next";

export default function Vitals() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1>{t("vitals.title", "Vitals")}</h1>
      <p className="text-gray-500">
        {t("vitals.empty", "No vitals recorded yet")}
      </p>
    </div>
  );
}
