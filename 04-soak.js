// ============================================================
//  04. SOAK / ENDURANCE-ТЕСТ (на выносливость, "долго и ровно")
//  Цель: держать УМЕРЕННУЮ нагрузку долго (десятки минут / часы)
//  и смотреть, не деградирует ли система со временем:
//    - утечки памяти (RAM растёт и не падает),
//    - переполнение логов/диска,
//    - медленное распухание пулов соединений/кэшей.
//  Такое НЕ видно в коротком load-тесте — только на дистанции.
//  Запуск:  k6 run 04-soak.js
//  (для реального теста поставь duration плато 30m-2h)
// ============================================================

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, THRESHOLDS } from "./lib/config.js";

export const options = {
  stages: [
    { duration: "2m",  target: 30 },  // разгон
    { duration: "10m", target: 30 },  // ДОЛГОЕ плато (увеличь до 30m-2h для настоящего soak)
    { duration: "2m",  target: 0 },   // спад
  ],
  thresholds: THRESHOLDS,
};

export default function () {
  const res = http.get(`${BASE_URL}/public/crocodiles/`);
  check(res, { "статус 200": (r) => r.status === 200 });
  sleep(1);
}
