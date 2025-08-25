import React from "react";
import { useTranslation } from "react-i18next";
export default function Meds() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1>{t("nav.meds","Meds")}</h1>
      <p className="text-gray-500">{t("meds.empty","No medications added yet")}</p>
    </div>
  );
}
