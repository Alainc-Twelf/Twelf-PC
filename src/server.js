import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 4318;
const HOST = "127.0.0.1";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");

app.use(cors());
app.use(express.json({ limit: "25mb" }));

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readConfig() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      const emptyConfig = {
        categories: [],
        fees: [],
        globalCosts: [],
        models: [],
      };
      await fs.writeFile(CONFIG_PATH, JSON.stringify(emptyConfig, null, 2), "utf8");
      return emptyConfig;
    }
    throw error;
  }
}

async function writeConfig(config) {
  await ensureDataDir();
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
}

app.get("/api/config", async (_req, res) => {
  try {
    const config = await readConfig();
    res.json(config);
  } catch (error) {
    console.error("GET /api/config failed:", error);
    res.status(500).json({ error: "Failed to read config" });
  }
});

app.put("/api/config", async (req, res) => {
  try {
    const config = req.body;

    if (!config || typeof config !== "object") {
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

    await writeConfig(config);
    res.json({ ok: true });
  } catch (error) {
    console.error("PUT /api/config failed:", error);
    res.status(500).json({ error: "Failed to save config" });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Config API running on http://${HOST}:${PORT}`);
});