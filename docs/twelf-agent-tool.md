# Twelf-PC Agent Tool Wrapper (Read-Only v1)

Small integration layer to let AI agents read trusted config/pricing data from Twelf-PC.

## File

- `src/agent/twelf-api-tool.js`

## Supported endpoints

- `GET /api/health`
- `GET /api/categories`
- `GET /api/models`
- `GET /api/fees`
- `GET /api/global-costs`

## Usage

```js
import { createTwelfApiTool } from "../src/agent/twelf-api-tool.js";

const twelf = createTwelfApiTool({
  baseUrl: "http://127.0.0.1:4318",
  // optional if server enforces x-api-key:
  apiKey: "your-key-here",
});

const health = await twelf.getHealth();
if (!health.ok) {
  console.error("Health check failed:", health.error);
} else {
  console.log("API health:", health.data); // { ok: true }
}

const categories = await twelf.getCategories();
if (categories.ok) {
  console.log("Categories:", categories.data);
}
```

## Response contract

Every tool call returns a normalized result:

```ts
{
  ok: boolean;
  data?: unknown;     // present on success
  error?: string;     // present on failure
  status: number;     // HTTP status, or 0 for network failure
}
```

## Error handling behavior

- Network error -> `ok: false`, `status: 0`
- Non-JSON response -> `ok: false` with parse error message
- 4xx/5xx response -> `ok: false` and backend `error` message when available

## Extending later for write operations

The wrapper intentionally exposes a shared `request(path, init)` helper.
To add PATCH endpoints later, add methods like:

```js
updateFee: (key, payload) =>
  request(`/api/fees/${encodeURIComponent(key)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
```

This keeps agent integration consistent while preserving clean JSON responses.
