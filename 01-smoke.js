// ============================================================
//  01. SMOKE-ТЕСТ ("дымовой")
//  Цель: убедиться, что сценарий рабочий и API отвечает,
//  ПОД МИНИМАЛЬНОЙ нагрузкой (1 пользователь, 10 секунд).
//  Всегда первый запуск.  Запуск:  k6 run 01-smoke.js
// ============================================================

import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL, HEADERS, PIZZA_PAYLOAD, THRESHOLDS } from "./lib/config.js";

export const options = {
  vus: 1,
  duration: "10s",
  thresholds: THRESHOLDS,
};

export default function () {
  // POST-запрос к QuickPizza: просим рекомендацию пиццы.
  const res = http.post(`${BASE_URL}/api/pizza`, PIZZA_PAYLOAD, { headers: HEADERS });

  // Парсим тело один раз (надёжнее, чем res.json('путь') в каждой проверке).
  const body = res.json();

  check(res, {
    "статус 200": (r) => r.status === 200,
    "есть название пиццы": () => body && body.pizza && body.pizza.name !== undefined,
    "быстрее 500 мс": (r) => r.timings.duration < 500,
  });

  sleep(1); // think time — пауза «человек читает результат»
}
