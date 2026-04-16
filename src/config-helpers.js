import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "data");
const CONFIG_PATH = path.join(DATA_DIR, "config.json");
const BACKUP_PATH = path.join(DATA_DIR, "config.backup.json");

const EMPTY_CONFIG = {
  categories: [],
  fees: [],
  globalCosts: [],
  models: [],
};

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function normalizeConfig(config) {
  if (!config || typeof config !== "object") {
    return structuredClone(EMPTY_CONFIG);
  }

  return {
    categories: Array.isArray(config.categories) ? config.categories : [],
    fees: Array.isArray(config.fees) ? config.fees : [],
    globalCosts: Array.isArray(config.globalCosts) ? config.globalCosts : [],
    models: Array.isArray(config.models) ? config.models : [],
  };
}

/**
 * Load config from disk, creating an empty file if it does not exist yet.
 */
export async function loadConfig() {
  await ensureDataDir();

  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return normalizeConfig(JSON.parse(raw));
  } catch (error) {
    if (error.code === "ENOENT") {
      await fs.writeFile(CONFIG_PATH, JSON.stringify(EMPTY_CONFIG, null, 2), "utf8");
      return structuredClone(EMPTY_CONFIG);
    }

    throw error;
  }
}

/**
 * Save config atomically:
 * 1) create backup from current file (if it exists)
 * 2) write temp file
 * 3) rename temp file to final path
 */
export async function saveConfig(config) {
  await ensureDataDir();

  const normalized = normalizeConfig(config);
  const tempPath = `${CONFIG_PATH}.tmp`;

  try {
    await fs.copyFile(CONFIG_PATH, BACKUP_PATH);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  await fs.writeFile(tempPath, JSON.stringify(normalized, null, 2), "utf8");
  await fs.rename(tempPath, CONFIG_PATH);

  return normalized;
}

export function findCategory(config, key) {
  return config.categories.find((category) => category?.key === key);
}

export function findModel(config, id) {
  return config.models.find((model) => model?.id === id);
}

export function findOption(category, optionId) {
  if (!category || !Array.isArray(category.options)) {
    return undefined;
  }

  return category.options.find((option) => option?.id === optionId);
}
