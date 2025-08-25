import React from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1>{t("title", "CareBee")}</h1>
      <p>{t("tagline", "Your personal care assistant")}</p>
      <button className="btn">{t("goToSOS", "goToSOS")}</button>
    </div>
  );
}
