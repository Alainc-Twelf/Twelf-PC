import express from "express";
import cors from "cors";
import {
  loadConfig,
  saveConfig,
  findCategory,
  findModel,
  findOption,
} from "./config-helpers.js";

const app = express();
const PORT = 4318;
const HOST = "127.0.0.1";

app.use(cors());
app.use(express.json({ limit: "25mb" }));

/**
 * Basic API key middleware.
 * If TWELF_API_KEY is not configured, routes are left open to preserve local DX.
 */
function requireApiKey(req, res, next) {
  const configuredApiKey = globalThis.process?.env?.TWELF_API_KEY;

  if (!configuredApiKey) {
    return next();
  }

  const apiKey = req.header("x-api-key");
  if (apiKey !== configuredApiKey) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  return next();
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isMutatingMethod(req) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
}

// Protect write routes.
app.use("/api", (req, res, next) => {
  if (!isMutatingMethod(req)) {
    return next();
  }

  return requireApiKey(req, res, next);
});

/** Existing compatibility endpoint: returns full config snapshot. */
app.get("/api/config", async (_req, res) => {
  try {
    const config = await loadConfig();
    res.json(config);
  } catch (error) {
    console.error("GET /api/config failed:", error);
    res.status(500).json({ error: "Failed to read config" });
  }
});

/**
 * Existing compatibility endpoint for the current frontend editor flow.
 * This route still accepts full snapshots, but validates the expected structure.
 */
app.put("/api/config", async (req, res) => {
  try {
    const config = req.body;

    if (!isObject(config)) {
      return res.status(400).json({ error: "Invalid config payload" });
    }

    if (
      !Array.isArray(config.categories) ||
      !Array.isArray(config.fees) ||
      !Array.isArray(config.globalCosts) ||
      !Array.isArray(config.models)
    ) {
      return res.status(400).json({ error: "Config payload missing required arrays" });
    }

    await saveConfig(config);
    return res.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/config failed:", error);
    return res.status(500).json({ error: "Failed to save config" });
  }
});


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// ---------- Read endpoints ----------

app.get("/api/categories", async (_req, res) => {
  try {
    const config = await loadConfig();
    res.json(config.categories);
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    res.status(500).json({ error: "Failed to read categories" });
  }
});

app.get("/api/categories/:key", async (req, res) => {
  try {
    const config = await loadConfig();
    const category = findCategory(config, req.params.key);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.json(category);
  } catch (error) {
    console.error("GET /api/categories/:key failed:", error);
    return res.status(500).json({ error: "Failed to read category" });
  }
});

app.get("/api/models", async (_req, res) => {
  try {
    const config = await loadConfig();
    res.json(config.models);
  } catch (error) {
    console.error("GET /api/models failed:", error);
    res.status(500).json({ error: "Failed to read models" });
  }
});

app.get("/api/models-lite", async (_req, res) => {
  try {
    const config = await loadConfig();
    const modelsLite = config.models.map((model) => {
      const withoutImage = { ...model };
      delete withoutImage.image;
      return withoutImage;
    });
    res.json(modelsLite);
  } catch (error) {
    console.error("GET /api/models-lite failed:", error);
    res.status(500).json({ error: "Failed to read models" });
  }
});

app.get("/api/models/:id", async (req, res) => {
  try {
    const config = await loadConfig();
    const model = findModel(config, req.params.id);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    return res.json(model);
  } catch (error) {
    console.error("GET /api/models/:id failed:", error);
    return res.status(500).json({ error: "Failed to read model" });
  }
});

app.get("/api/fees", async (_req, res) => {
  try {
    const config = await loadConfig();
    res.json(config.fees);
  } catch (error) {
    console.error("GET /api/fees failed:", error);
    res.status(500).json({ error: "Failed to read fees" });
  }
});

app.get("/api/global-costs", async (_req, res) => {
  try {
    const config = await loadConfig();
    res.json(config.globalCosts);
  } catch (error) {
    console.error("GET /api/global-costs failed:", error);
    res.status(500).json({ error: "Failed to read global costs" });
  }
});

// ---------- Write endpoints ----------

function generateOptionId() {
  // Stable and collision-resistant id for agent/client generated options.
  return `opt_${crypto.randomUUID()}`;
}

app.patch("/api/fees/:key", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    const config = await loadConfig();
    const feeIndex = config.fees.findIndex((fee) => fee?.key === req.params.key);

    if (feeIndex === -1) {
      return res.status(404).json({ error: "Fee not found" });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "key") && req.body.key !== req.params.key) {
      return res.status(400).json({ error: "Fee key is immutable" });
    }

    config.fees[feeIndex] = { ...config.fees[feeIndex], ...req.body, key: req.params.key };
    await saveConfig(config);

    return res.json(config.fees[feeIndex]);
  } catch (error) {
    console.error("PATCH /api/fees/:key failed:", error);
    return res.status(500).json({ error: "Failed to update fee" });
  }
});

app.post("/api/fees", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    if (typeof req.body.key !== "string" || !req.body.key.trim()) {
      return res.status(400).json({ error: "Fee key is required" });
    }

    const key = req.body.key.trim();
    const config = await loadConfig();
    const existingFee = config.fees.find((fee) => fee?.key === key);

    if (existingFee) {
      return res.status(409).json({ error: "Fee key already exists" });
    }

    const fee = { ...req.body, key };
    config.fees.push(fee);
    await saveConfig(config);

    return res.status(201).json(fee);
  } catch (error) {
    console.error("POST /api/fees failed:", error);
    return res.status(500).json({ error: "Failed to create fee" });
  }
});

app.patch("/api/global-costs/:key", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    const config = await loadConfig();
    const globalCostIndex = config.globalCosts.findIndex(
      (cost) => cost?.key === req.params.key,
    );

    if (globalCostIndex === -1) {
      return res.status(404).json({ error: "Global cost not found" });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "key") && req.body.key !== req.params.key) {
      return res.status(400).json({ error: "Global cost key is immutable" });
    }

    config.globalCosts[globalCostIndex] = {
      ...config.globalCosts[globalCostIndex],
      ...req.body,
      key: req.params.key,
    };

    await saveConfig(config);
    return res.json(config.globalCosts[globalCostIndex]);
  } catch (error) {
    console.error("PATCH /api/global-costs/:key failed:", error);
    return res.status(500).json({ error: "Failed to update global cost" });
  }
});

app.post("/api/global-costs", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    if (typeof req.body.key !== "string" || !req.body.key.trim()) {
      return res.status(400).json({ error: "Global cost key is required" });
    }

    const key = req.body.key.trim();
    const config = await loadConfig();
    const existingGlobalCost = config.globalCosts.find((cost) => cost?.key === key);

    if (existingGlobalCost) {
      return res.status(409).json({ error: "Global cost key already exists" });
    }

    const globalCost = { ...req.body, key };
    config.globalCosts.push(globalCost);
    await saveConfig(config);

    return res.status(201).json(globalCost);
  } catch (error) {
    console.error("POST /api/global-costs failed:", error);
    return res.status(500).json({ error: "Failed to create global cost" });
  }
});

app.patch("/api/categories/:key/options/:optionId", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    const config = await loadConfig();
    const category = findCategory(config, req.params.key);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!Array.isArray(category.options)) {
      category.options = [];
    }

    const option = findOption(category, req.params.optionId);
    if (!option) {
      return res.status(404).json({ error: "Option not found" });
    }

    if (
      Object.prototype.hasOwnProperty.call(req.body, "id") &&
      req.body.id !== req.params.optionId
    ) {
      return res.status(400).json({ error: "Option id is immutable" });
    }

    Object.assign(option, req.body, { id: req.params.optionId });
    await saveConfig(config);

    return res.json(option);
  } catch (error) {
    console.error("PATCH /api/categories/:key/options/:optionId failed:", error);
    return res.status(500).json({ error: "Failed to update option" });
  }
});

app.post("/api/categories/:key/options", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    const config = await loadConfig();
    const category = findCategory(config, req.params.key);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (!Array.isArray(category.options)) {
      category.options = [];
    }

    const requestedId =
      typeof req.body.id === "string" && req.body.id.trim() ? req.body.id.trim() : generateOptionId();

    const existingOption = findOption(category, requestedId);
    if (existingOption) {
      return res.status(409).json({ error: "Option id already exists" });
    }

    const option = { ...req.body, id: requestedId };
    category.options.push(option);
    await saveConfig(config);

    return res.status(201).json(option);
  } catch (error) {
    console.error("POST /api/categories/:key/options failed:", error);
    return res.status(500).json({ error: "Failed to create option" });
  }
});

app.post("/api/models", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    if (typeof req.body.id !== "string" || !req.body.id.trim()) {
      return res.status(400).json({ error: "Model id is required" });
    }

    const id = req.body.id.trim();
    const config = await loadConfig();
    const existingModel = findModel(config, id);

    if (existingModel) {
      return res.status(409).json({ error: "Model id already exists" });
    }

    const model = { ...req.body, id };
    config.models.push(model);
    await saveConfig(config);

    return res.status(201).json(model);
  } catch (error) {
    console.error("POST /api/models failed:", error);
    return res.status(500).json({ error: "Failed to create model" });
  }
});

app.patch("/api/models/:id", async (req, res) => {
  try {
    if (!isObject(req.body)) {
      return res.status(400).json({ error: "Payload must be an object" });
    }

    const config = await loadConfig();
    const model = findModel(config, req.params.id);

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "id") && req.body.id !== req.params.id) {
      return res.status(400).json({ error: "Model id is immutable" });
    }

    Object.assign(model, req.body, { id: req.params.id });
    await saveConfig(config);

    return res.json(model);
  } catch (error) {
    console.error("PATCH /api/models/:id failed:", error);
    return res.status(500).json({ error: "Failed to update model" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Config API running on http://${HOST}:${PORT}`);
});
