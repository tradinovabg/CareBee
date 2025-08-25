import React from "react";
import { useTranslation } from "react-i18next";
export default function Profile() {
  const { t } = useTranslation();
  return <div className="container"><h1>{t("profile.title","Profile")}</h1></div>;
}
