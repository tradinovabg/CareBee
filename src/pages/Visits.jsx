import React from "react";
import { useTranslation } from "react-i18next";
export default function Visits() {
  const { t } = useTranslation();
  return <div className="container"><h1>{t("nav.visits","Visits")}</h1></div>;
}
