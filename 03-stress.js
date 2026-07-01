// ============================================================
//  03. STRESS-ТЕСТ (стресс, "ищем потолок")
//  Цель: наращивать нагрузку ВЫШЕ ожидаемой, пока система не
//  начнёт деградировать (растёт latency / появляются ошибки).
//  Запуск:  k6 run 03-stress.js
//  Провал порогов здесь ОЖИДАЕМ — точка деградации и есть "потолок".
// ============================================================

import http from "k6/http";
import { check } from "k6";
import { BASE_URL, HEADERS, PIZZA_PAYLOAD } from "./lib/config.js";

export const options = {
  stages: [
    { duration: "1m", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "1m", target: 400 },
    { duration: "1m", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"], // мягкий, непрерывающий: хотим досмотреть, где ломается
  },
};

export default function () {
  const res = http.post(`${BASE_URL}/api/pizza`, PIZZA_PAYLOAD, { headers: HEADERS });
  check(res, { "статус 200": (r) => r.status === 200 });
  // Без sleep: на стрессе выжимаем максимум.
}
