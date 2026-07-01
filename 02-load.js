// ============================================================
//  02. LOAD-ТЕСТ (нагрузочный, "обычный рабочий день")
//  Цель: держит ли система ОЖИДАЕМУЮ нагрузку и укладывается ли в SLO.
//  Запуск:  k6 run 02-load.js
// ============================================================

import http from "k6/http";
import { check, sleep, group } from "k6";
import { BASE_URL, HEADERS, PIZZA_PAYLOAD, THRESHOLDS } from "./lib/config.js";

export const options = {
  // stages = профиль нагрузки во времени (плавный разгон → плато → спад).
  stages: [
    { duration: "30s", target: 20 }, // разгон 0 -> 20 VU
    { duration: "1m",  target: 20 }, // плато 20 VU
    { duration: "30s", target: 0 },  // спад
  ],
  thresholds: THRESHOLDS,
};

export default function () {
  group("Заказ рекомендации пиццы", () => {
    const res = http.post(`${BASE_URL}/api/pizza`, PIZZA_PAYLOAD, { headers: HEADERS });
    const body = res.json();
    check(res, {
      "статус 200": (r) => r.status === 200,
      "есть название пиццы": () => body && body.pizza && body.pizza.name !== undefined,
      "есть ингредиенты": () => body && body.pizza && Array.isArray(body.pizza.ingredients),
    });
  });

  sleep(Math.random() * 2 + 1); // случайная пауза 1-3 сек — разные пользователи
}
