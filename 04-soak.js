// ============================================================
//  04. SOAK / ENDURANCE-ТЕСТ (на выносливость, "долго и ровно")
//  Цель: умеренная нагрузка ДОЛГО — ищем утечки памяти,
//  переполнение логов/диска, медленную деградацию со временем.
//  Запуск:  k6 run 04-soak.js  (для реального soak увеличь плато до 30m-2h)
// ============================================================

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, HEADERS, PIZZA_PAYLOAD, THRESHOLDS } from "./lib/config.js";

export const options = {
  stages: [
    { duration: "2m",  target: 30 },
    { duration: "10m", target: 30 }, // ДОЛГОЕ плато (увеличь до 30m-2h для настоящего soak)
    { duration: "2m",  target: 0 },
  ],
  thresholds: THRESHOLDS,
};

export default function () {
  const res = http.post(`${BASE_URL}/api/pizza`, PIZZA_PAYLOAD, { headers: HEADERS });
  check(res, { "статус 200": (r) => r.status === 200 });
  sleep(1);
}
