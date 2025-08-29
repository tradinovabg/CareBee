import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t p-4 text-sm text-center">
      <nav className="space-x-4">
        <NavLink to="/faq" className="hover:underline">
          {t("footer.faq")}
        </NavLink>
        <NavLink to="/privacy" className="hover:underline">
          {t("footer.privacy")}
        </NavLink>
        <NavLink to="/guide" className="hover:underline">
          {t("footer.guide")}
        </NavLink>
      </nav>
    </footer>
  );
}
