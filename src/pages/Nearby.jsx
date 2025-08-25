import React from "react";
import { useTranslation } from "react-i18next";
export default function Nearby() {
  const { t } = useTranslation();
  return <div className="container"><h1>{t("nav.nearby","Nearby")}</h1></div>;
}
