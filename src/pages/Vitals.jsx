import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js";
import {
  getAutoSendSettings,
  setAutoSendSettings,
  getLastSummaryAt,
  sendDailySummaryNow,
} from "../lib/dailySummary.js";

// ⚠️ если у тебя реально нет этого модуля, удали строку ниже
// иначе оставь, но обязательно с кавычками
import "codex/add-auto-send-settings-ui-in-vitals";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Vitals() {
  const { t } = useTranslation();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");

    const chart = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [
          {
            label: t("vitals.heartRate", "Heart Rate"),
            data: [72, 75, 78, 74, 73],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.2,
          },
          {
            label: t("vitals.temperature", "Temperature"),
            data: [36.6, 36.7, 36.8, 36.7, 36.6],
            borderColor: "rgb(255, 99, 132)",
            tension: 0.2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: { enabled: true },
        },
      },
    });

    return () => chart.destroy();
  }, [t]);

  return (
    <div className="container">
      <h1>{t("vitals.title", "Vitals")}</h1>
      <canvas ref={canvasRef} width={400} height={200}></canvas>

      <div style={{ marginTop: 20 }}>
        <button className="btn" onClick={() => sendDailySummaryNow()}>
          {t("vitals.sendNow", "Send Daily Summary Now")}
        </button>
        <div style={{ marginTop: 10, color: "#555" }}>
          {t("vitals.lastSummary", "Last summary at")}: {getLastSummaryAt() || "-"}
        </div>
      </div>
    </div>
  );
}
