/**
 * Twelf-PC API tool wrapper for agent integrations.
 *
 * Read-only first design:
 * - exposes trusted GET endpoints for pricing/config discovery
 * - keeps one internal request helper so write endpoints can be added later
 */

function joinUrl(baseUrl, path) {
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${trimmedBase}${path}`;
}

function normalizeApiError(status, payload, fallbackMessage) {
  if (payload && typeof payload === "object" && typeof payload.error === "string") {
    return payload.error;
  }

  return `${fallbackMessage} (status ${status})`;
}

/**
 * Create a Twelf-PC API tool client.
 *
 * @param {object} options
 * @param {string} [options.baseUrl] - API origin, e.g. http://127.0.0.1:4318
 * @param {string} [options.apiKey] - optional x-api-key value
 */
export function createTwelfApiTool(options = {}) {
  const {
    baseUrl = "http://127.0.0.1:4318",
    apiKey = globalThis.process?.env?.TWELF_API_KEY,
  } = options;

  /**
   * Single request helper used by all endpoints.
   * Keeping this centralized makes PATCH/POST support easy to add later.
   */
  async function request(path, init = {}) {
    const headers = {
      Accept: "application/json",
      ...(init.headers || {}),
    };

    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    let response;
    try {
      response = await fetch(joinUrl(baseUrl, path), {
        ...init,
        headers,
      });
    } catch (error) {
      return {
        ok: false,
        error: `Network error while calling ${path}: ${error.message}`,
        status: 0,
      };
    }

    let json;
    try {
      json = await response.json();
    } catch {
      return {
        ok: false,
        error: `Invalid JSON from ${path}`,
        status: response.status,
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: normalizeApiError(response.status, json, `Request failed for ${path}`),
        status: response.status,
      };
    }

    return {
      ok: true,
      data: json,
      status: response.status,
    };
  }

  // Read-only surface for agents (phase 1).
  return {
    request,
    getHealth: () => request("/api/health"),
    getCategories: () => request("/api/categories"),
    getModels: () => request("/api/models"),
    getFees: () => request("/api/fees"),
    getGlobalCosts: () => request("/api/global-costs"),
  };
}
