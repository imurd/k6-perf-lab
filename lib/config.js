// ============================================================
//  Общие настройки для всех сценариев.
// ============================================================

// Официальный учебный сервис от Grafana/k6 — QuickPizza.
// (Старый test-api.k6.io закрыт и редиректит сюда, поэтому мигрировали.)
export const BASE_URL = "https://quickpizza.grafana.com";

// Публичный демо-токен QuickPizza (НЕ секрет — он общий, из документации k6).
export const HEADERS = {
  "Content-Type": "application/json",
  "Authorization": "Token abcdef0123456789",
};

// Тело запроса рекомендации пиццы.
export const PIZZA_PAYLOAD = JSON.stringify({
  maxCaloriesPerSlice: 1000,
  mustBeVegetarian: false,
  excludedIngredients: [],
  excludedTools: [],
  maxNumberOfToppings: 5,
  minNumberOfToppings: 2,
});

// --- Целевые показатели (SLO) ---
//   http_req_duration p(95)<500  — 95% запросов быстрее 500 мс
//   http_req_failed   rate<0.01  — доля упавших запросов меньше 1%
// Провал порога → k6 завершится с exit code 1 (так тест ломает CI).
export const THRESHOLDS = {
  http_req_duration: ["p(95)<500", "p(99)<1000"],
  http_req_failed: ["rate<0.01"],
};
