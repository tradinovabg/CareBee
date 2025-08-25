import React from "react";
import { useTranslation } from "react-i18next";
export default function Nearby() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1>{t("nearby.title","Nearby")}</h1>
      <p className="text-gray-500">{t("nearby.empty","No nearby data")}</p>
    </div>
  );
}
