import { useEffect, useMemo, useState } from "react";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const SCORE_FIELDS = [
  "speed_score",
  "index_score",
  "network_score",
  "graphics_score",
  "utility_score",
  "look_score",
  "airflow_score",
  "rarity_score",
];

const formatScoreLabel = (field) => field.replaceAll("_", " ");

function getAvailableScores(item) {
  return SCORE_FIELDS
    .filter((field) => item?.[field] !== undefined && item?.[field] !== null)
    .map((field) => ({ field, value: item[field] }));
}

const createOption = (name, price = 0, id = makeId()) => ({ id, name, price });
const createCategory = (key, label, options, id = makeId()) => ({
  id,
  key,
  label,
  options,
});
const createFee = (key, label, value, id = makeId()) => ({
  id,
  key,
  label,
  value,
});
const createGlobalCost = (key, label, value, id = makeId()) => ({
  id,
  key,
  label,
  value,
});
const createModel = (data) => ({
  id: makeId(),
  image: "",
  extras: 0,
  ...data,
});

const initialCategories = [
  createCategory("cpu", "CPU", [
    createOption("Ryzen 5 5500", 95),
    createOption("Ryzen 5 9600X", 210),
    createOption("Ryzen 7 7700", 250),
    createOption("Ryzen 7 9800X3D", 479),
    createOption("Intel i5", 220),
    createOption("Intel i7", 330),
    createOption("Intel i9", 500),
  ]),
  createCategory("gpu", "GPU", [
    createOption("RTX 3050", 240),
    createOption("RTX 5060", 360),
    createOption("RTX 5060 Ti 8GB", 430),
    createOption("RTX 5060 Ti 16GB", 520),
    createOption("RTX 5070", 690),
    createOption("RTX 5080", 1150),
    createOption("AMD RX 7600", 210),
    createOption("AMD RX 9060 XT 8GB", 450),
    createOption("AMD RX 9060 XT 16GB", 560),
    createOption("AMD RX 9070 XT", 700),
  ]),
  createCategory("motherboard", "Motherboard", [
    createOption("AM4", 100),
    createOption("AM5", 220),
    createOption("LGA1700 DDR4", 140),
    createOption("LGA1700 DDR5", 180),
  ]),
  createCategory("ram", "RAM", [
    createOption("16GB DDR4", 45),
    createOption("32GB DDR4", 75),
    createOption("16GB DDR5", 70),
    createOption("32GB DDR5", 120),
  ]),
  createCategory("storage", "Storage", [
    createOption("500GB", 45),
    createOption("1TB", 80),
    createOption("2TB", 150),
  ]),
  createCategory("psu", "PSU", [
    createOption("650W", 60),
    createOption("750W", 85),
    createOption("850W", 110),
  ]),
  createCategory("caseType", "Case", [
    createOption("Low", 60),
    createOption("Medium", 100),
    createOption("High", 160),
  ]),
  createCategory("cooler", "Cooler", [
    createOption("Air Cooler", 35),
    createOption("240mm", 75),
    createOption("360mm", 100),
  ]),
];

const initialFees = [
  createFee("amazon", "Amazon Fee %", 15),
  createFee("newegg", "Newegg Fee %", 10),
  createFee("shopify", "Shopify Fee %", 3),
];

const initialGlobalCosts = [
  createGlobalCost("labor", "Labor", 0),
  createGlobalCost("shippingInbound", "Shipping Inbound", 0),
  createGlobalCost("targetMargin", "Target Margin %", 20),
];

function findOptionId(categories, categoryKey, optionName) {
  const category = categories.find((c) => c.key === categoryKey);
  if (!category) return "";
  const option = category.options.find((opt) => opt.name === optionName);
  return option?.id || category.options[0]?.id || "";
}

const initialModels = [
  createModel({
    name: "Atlas",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 7 9800X3D"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 5080"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM5"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR5"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "850W"),
    caseType: findOptionId(initialCategories, "caseType", "High"),
    cooler: findOptionId(initialCategories, "cooler", "360mm"),
  }),
  createModel({
    name: "Pathfinder v1",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 7 7700"),
    gpu: findOptionId(initialCategories, "gpu", "AMD RX 9070 XT"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM5"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR5"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "850W"),
    caseType: findOptionId(initialCategories, "caseType", "High"),
    cooler: findOptionId(initialCategories, "cooler", "360mm"),
  }),
  createModel({
    name: "Pathfinder v2",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 7 7700"),
    gpu: findOptionId(initialCategories, "gpu", "AMD RX 9070 XT"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM5"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR5"),
    storage: findOptionId(initialCategories, "storage", "2TB"),
    psu: findOptionId(initialCategories, "psu", "850W"),
    caseType: findOptionId(initialCategories, "caseType", "High"),
    cooler: findOptionId(initialCategories, "cooler", "360mm"),
  }),
  createModel({
    name: "Phoenix",
    cpu: findOptionId(initialCategories, "cpu", "Intel i7"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 5060 Ti 16GB"),
    motherboard: findOptionId(initialCategories, "motherboard", "LGA1700 DDR4"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "750W"),
    caseType: findOptionId(initialCategories, "caseType", "Medium"),
    cooler: findOptionId(initialCategories, "cooler", "240mm"),
  }),
  createModel({
    name: "Moonlight",
    cpu: findOptionId(initialCategories, "cpu", "Intel i5"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 5070"),
    motherboard: findOptionId(initialCategories, "motherboard", "LGA1700 DDR4"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "850W"),
    caseType: findOptionId(initialCategories, "caseType", "High"),
    cooler: findOptionId(initialCategories, "cooler", "360mm"),
  }),
  createModel({
    name: "Eclipse",
    cpu: findOptionId(initialCategories, "cpu", "Intel i5"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 5070"),
    motherboard: findOptionId(initialCategories, "motherboard", "LGA1700 DDR4"),
    ram: findOptionId(initialCategories, "ram", "32GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "850W"),
    caseType: findOptionId(initialCategories, "caseType", "High"),
    cooler: findOptionId(initialCategories, "cooler", "360mm"),
  }),
  createModel({
    name: "Nyx",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 5 5500"),
    gpu: findOptionId(initialCategories, "gpu", "AMD RX 7600"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM4"),
    ram: findOptionId(initialCategories, "ram", "16GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "650W"),
    caseType: findOptionId(initialCategories, "caseType", "Low"),
    cooler: findOptionId(initialCategories, "cooler", "240mm"),
  }),
  createModel({
    name: "Onyx",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 5 5500"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 3050"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM4"),
    ram: findOptionId(initialCategories, "ram", "16GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "500GB"),
    psu: findOptionId(initialCategories, "psu", "650W"),
    caseType: findOptionId(initialCategories, "caseType", "Low"),
    cooler: findOptionId(initialCategories, "cooler", "Air Cooler"),
  }),
  createModel({
    name: "Astra",
    cpu: findOptionId(initialCategories, "cpu", "Intel i5"),
    gpu: findOptionId(initialCategories, "gpu", "RTX 5060"),
    motherboard: findOptionId(initialCategories, "motherboard", "LGA1700 DDR4"),
    ram: findOptionId(initialCategories, "ram", "16GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "750W"),
    caseType: findOptionId(initialCategories, "caseType", "Medium"),
    cooler: findOptionId(initialCategories, "cooler", "240mm"),
  }),
  createModel({
    name: "Obsidian",
    cpu: findOptionId(initialCategories, "cpu", "Ryzen 5 5500"),
    gpu: findOptionId(initialCategories, "gpu", "AMD RX 7600"),
    motherboard: findOptionId(initialCategories, "motherboard", "AM4"),
    ram: findOptionId(initialCategories, "ram", "16GB DDR4"),
    storage: findOptionId(initialCategories, "storage", "1TB"),
    psu: findOptionId(initialCategories, "psu", "650W"),
    caseType: findOptionId(initialCategories, "caseType", "Medium"),
    cooler: findOptionId(initialCategories, "cooler", "Air Cooler"),
  }),
];

const API_BASE = "/api";

const defaultConfig = {
  categories: initialCategories,
  fees: initialFees,
  globalCosts: initialGlobalCosts,
  models: initialModels,
};

function migrateConfig(rawConfig) {
  const config = rawConfig || {};

  const hasUsableCategories =
    Array.isArray(config.categories) && config.categories.length > 0;
  const hasUsableFees =
    Array.isArray(config.fees) && config.fees.length > 0;
  const hasUsableGlobalCosts =
    Array.isArray(config.globalCosts) && config.globalCosts.length > 0;
  const hasUsableModels =
    Array.isArray(config.models) && config.models.length > 0;

  const categories = hasUsableCategories ? config.categories : initialCategories;
  const fees = hasUsableFees ? config.fees : initialFees;
  const globalCosts = hasUsableGlobalCosts ? config.globalCosts : initialGlobalCosts;
  let models = hasUsableModels ? config.models : initialModels;

  models = models.map((model) => {
    const migrated = { ...model };

    categories.forEach((category) => {
      const currentValue = migrated[category.key];
      const optionIds = new Set(category.options.map((opt) => opt.id));

      if (!currentValue) {
        migrated[category.key] = category.options[0]?.id || "";
        return;
      }

      if (optionIds.has(currentValue)) {
        return;
      }

      const matchedOption = category.options.find((opt) => opt.name === currentValue);
      migrated[category.key] = matchedOption?.id || category.options[0]?.id || "";
    });

    if (typeof migrated.image !== "string") migrated.image = "";
    if (migrated.extras === undefined || migrated.extras === null) migrated.extras = 0;

    return migrated;
  });

  return { categories, fees, globalCosts, models };
}

function buildEmptyQuote(categories) {
  const quote = {
    id: makeId(),
    name: "Custom Quote",
    extras: 0,
    notes: "",
    image: "",
  };

  categories.forEach((category) => {
    quote[category.key] = category.options[0]?.id || "";
  });

  return quote;
}

export default function App() {
  const [view, setView] = useState("results");
  const [categories, setCategories] = useState([]);
  const [fees, setFees] = useState([]);
  const [globalCosts, setGlobalCosts] = useState([]);
  const [models, setModels] = useState([]);
  const [newFeeName, setNewFeeName] = useState("");
  const [newCostName, setNewCostName] = useState("");
  const [newCategoryLabel, setNewCategoryLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [loadError, setLoadError] = useState("");
  const [quoteDraft, setQuoteDraft] = useState(() => buildEmptyQuote(initialCategories));

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(`${API_BASE}/config`);
        if (!response.ok) throw new Error(`Failed to load config: ${response.status}`);

        const data = await response.json();
        const migrated = migrateConfig(data);

        if (!cancelled) {
          setCategories(migrated.categories);
          setFees(migrated.fees);
          setGlobalCosts(migrated.globalCosts);
          setModels(migrated.models);
          setQuoteDraft((prev) => migrateQuoteDraft(prev, migrated.categories));
        }
      } catch (error) {
        console.error(error);
        const fallback = migrateConfig(defaultConfig);

        if (!cancelled) {
          setCategories(fallback.categories);
          setFees(fallback.fees);
          setGlobalCosts(fallback.globalCosts);
          setModels(fallback.models);
          setQuoteDraft((prev) => migrateQuoteDraft(prev, fallback.categories));
          setLoadError("No se pudo cargar desde el servidor, usando valores por defecto.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const globalCostMap = useMemo(
    () => Object.fromEntries(globalCosts.map((item) => [item.key, Number(item.value) || 0])),
    [globalCosts]
  );

  const categoryOptionMaps = useMemo(() => {
    const maps = {};
    categories.forEach((category) => {
      maps[category.key] = Object.fromEntries(
        category.options.map((option) => [
          option.id,
          {
            ...option,
            price: Number(option.price) || 0,
          },
        ])
      );
    });
    return maps;
  }, [categories]);

  const categoryDisplayMap = useMemo(() => {
    const maps = {};
    categories.forEach((category) => {
      maps[category.key] = Object.fromEntries(
        category.options.map((option) => [option.id, option.name])
      );
    });
    return maps;
  }, [categories]);

  const calcSuggestedPrice = (baseCost, feePercent) => {
    const fee = Number(feePercent || 0) / 100;
    const margin = Number(globalCostMap.targetMargin || 0) / 100;
    const denominator = 1 - fee - margin;
    if (denominator <= 0) return 0;
    return baseCost / denominator;
  };

  const buildComputedItem = (item) => {
    const categoryCost = categories.reduce((sum, category) => {
      const selectedOptionId = item[category.key];
      const selectedOption = categoryOptionMaps[category.key]?.[selectedOptionId];
      return sum + Number(selectedOption?.price || 0);
    }, 0);

    const baseCost =
      categoryCost +
      Number(globalCostMap.labor || 0) +
      Number(globalCostMap.shippingInbound || 0) +
      Number(item.extras || 0);

    return {
      ...item,
      displayValues: Object.fromEntries(
        categories.map((category) => [
          category.key,
          categoryDisplayMap[category.key]?.[item[category.key]] || "",
        ])
      ),
      partsBreakdown: categories.map((category) => {
        const option = categoryOptionMaps[category.key]?.[item[category.key]];
        return {
          key: category.key,
          label: category.label,
          optionName: option?.name || "",
          price: Number(option?.price || 0),
        };
      }),
      baseCost,
      storePrices: fees.map((fee) => {
        const storePrice = calcSuggestedPrice(baseCost, fee.value);
        const feeAmount = storePrice * (Number(fee.value || 0) / 100);
        const profit = storePrice - feeAmount - baseCost;

        return {
          id: fee.id,
          key: fee.key,
          label: fee.label.replace(" %", ""),
          value: storePrice,
          feeAmount,
          profit,
        };
      }),
    };
  };

  const computedModels = useMemo(() => {
    return models.map((model) => buildComputedItem(model));
  }, [models, categories, categoryOptionMaps, categoryDisplayMap, globalCostMap, fees]);

  const computedQuote = useMemo(() => {
    return buildComputedItem(quoteDraft);
  }, [quoteDraft, categories, categoryOptionMaps, categoryDisplayMap, globalCostMap, fees]);

  const exportPricingMatrix = () => {
    const headers = [
      "Model",
      ...categories.map((category) => category.label),
      "Extras",
      "Base Cost",
      ...fees.map((fee) => fee.label.replace(" %", "")),
    ];

    const rows = computedModels.map((model) => [
      model.name,
      ...categories.map((category) => model.displayValues?.[category.key] || ""),
      Number(model.extras || 0).toFixed(2),
      Number(model.baseCost || 0).toFixed(2),
      ...model.storePrices.map((store) => Number(store.value || 0).toFixed(2)),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    downloadCsv(csvContent, "twelf-pricing-matrix.csv");
  };

  const exportQuoteToCsv = () => {
    const lines = [
      ["Quote Name", computedQuote.name],
      [],
      ["Component", "Selection", "Price"],
      ...computedQuote.partsBreakdown.map((part) => [
        part.label,
        part.optionName,
        Number(part.price || 0).toFixed(2),
      ]),
      ["Extras", computedQuote.notes || "Manual extras", Number(computedQuote.extras || 0).toFixed(2)],
      ["Labor", "Global Cost", Number(globalCostMap.labor || 0).toFixed(2)],
      ["Shipping Inbound", "Global Cost", Number(globalCostMap.shippingInbound || 0).toFixed(2)],
      [],
      ["Base Cost", Number(computedQuote.baseCost || 0).toFixed(2)],
      [],
      ["Channel", "Suggested Price", "Fee Amount", "Profit"],
      ...computedQuote.storePrices.map((store) => [
        store.label,
        Number(store.value || 0).toFixed(2),
        Number(store.feeAmount || 0).toFixed(2),
        Number(store.profit || 0).toFixed(2),
      ]),
    ];

    const csvContent = lines
      .map((row) =>
        row.length === 0
          ? ""
          : row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const safeName = (computedQuote.name || "custom-quote")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    downloadCsv(csvContent, `${safeName || "custom-quote"}.csv`);
  };

  const saveConfigToServer = async ({
    nextCategories = categories,
    nextFees = fees,
    nextGlobalCosts = globalCosts,
    nextModels = models,
  }) => {
    try {
      setSaving(true);
      setSaveMessage("");

      const response = await fetch(`${API_BASE}/config`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: nextCategories,
          fees: nextFees,
          globalCosts: nextGlobalCosts,
          models: nextModels,
        }),
      });

      if (!response.ok) throw new Error(`Failed to save config: ${response.status}`);

      setSaveMessage("Saved");
      setTimeout(() => setSaveMessage(""), 1500);
    } catch (error) {
      console.error(error);
      setSaveMessage("Save failed");
      setTimeout(() => setSaveMessage(""), 2500);
    } finally {
      setSaving(false);
    }
  };

  const updateCategoryLabel = (categoryId, value) => {
    const nextCategories = categories.map((category) =>
      category.id === categoryId ? { ...category, label: value } : category
    );
    setCategories(nextCategories);
    setQuoteDraft((prev) => migrateQuoteDraft(prev, nextCategories));
    saveConfigToServer({ nextCategories });
  };

  const updateOption = (categoryId, optionId, field, value) => {
    const nextCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            options: category.options.map((option) =>
              option.id === optionId ? { ...option, [field]: value } : option
            ),
          }
        : category
    );
    setCategories(nextCategories);
    setQuoteDraft((prev) => migrateQuoteDraft(prev, nextCategories));
    saveConfigToServer({ nextCategories });
  };

  const updateOptionScore = async (category, optionId, field, rawValue) => {
    const nextValue = Number(rawValue);
    if (!Number.isFinite(nextValue)) return;

    try {
      const response = await fetch(
        `${API_BASE}/categories/${encodeURIComponent(category.key)}/options/${encodeURIComponent(optionId)}/score`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ field, value: nextValue }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update score: ${response.status}`);
      }

      const updatedOption = await response.json();

      setCategories((prevCategories) => {
        const nextCategories = prevCategories.map((currentCategory) =>
          currentCategory.id !== category.id
            ? currentCategory
            : {
                ...currentCategory,
                options: currentCategory.options.map((option) =>
                  option.id === optionId ? { ...option, ...updatedOption } : option
                ),
              }
        );
        setQuoteDraft((prev) => migrateQuoteDraft(prev, nextCategories));
        return nextCategories;
      });
    } catch (error) {
      console.error(error);
      setSaveMessage("Save failed");
      setTimeout(() => setSaveMessage(""), 2500);
    }
  };

  const addOption = (categoryId) => {
    const nextCategories = categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            options: [...category.options, createOption("New Option", 0)],
          }
        : category
    );
    setCategories(nextCategories);
    setQuoteDraft((prev) => migrateQuoteDraft(prev, nextCategories));
    saveConfigToServer({ nextCategories });
  };

  const removeOption = (categoryId, optionId) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const nextOptions = category.options.filter((opt) => opt.id !== optionId);
    if (nextOptions.length === 0) {
      alert("Cannot delete the last option in a category");
      return;
    }

    const nextCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, options: nextOptions } : cat
    );

    const replacementOptionId = nextOptions[0].id;
    const nextModels = models.map((model) => {
      if (model[category.key] !== optionId) return model;
      return { ...model, [category.key]: replacementOptionId };
    });

    setCategories(nextCategories);
    setModels(nextModels);
    setQuoteDraft((prev) => {
      const nextDraft = migrateQuoteDraft(prev, nextCategories);
      if (nextDraft[category.key] === optionId) {
        return { ...nextDraft, [category.key]: replacementOptionId };
      }
      return nextDraft;
    });
    saveConfigToServer({ nextCategories, nextModels });
  };

  const addCategory = () => {
    if (!newCategoryLabel.trim()) return;

    const key = newCategoryLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    if (categories.some((c) => c.key === key)) return;

    const defaultOption = createOption("Default Option", 0);
    const newCategory = createCategory(key, newCategoryLabel.trim(), [defaultOption]);
    const nextCategories = [...categories, newCategory];
    const nextModels = models.map((model) => ({
      ...model,
      [key]: defaultOption.id,
    }));

    setCategories(nextCategories);
    setModels(nextModels);
    setQuoteDraft((prev) => ({ ...prev, [key]: defaultOption.id }));
    setNewCategoryLabel("");
    saveConfigToServer({ nextCategories, nextModels });
  };

  const removeCategory = (categoryKey) => {
    const nextCategories = categories.filter((category) => category.key !== categoryKey);
    const nextModels = models.map((model) => {
      const copy = { ...model };
      delete copy[categoryKey];
      return copy;
    });

    setCategories(nextCategories);
    setModels(nextModels);
    setQuoteDraft((prev) => {
      const copy = { ...prev };
      delete copy[categoryKey];
      return copy;
    });
    saveConfigToServer({ nextCategories, nextModels });
  };

  const updateFee = (feeId, field, value) => {
    const nextFees = fees.map((fee) => (fee.id === feeId ? { ...fee, [field]: value } : fee));
    setFees(nextFees);
    saveConfigToServer({ nextFees });
  };

  const addFee = () => {
    if (!newFeeName.trim()) return;

    const key = newFeeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    if (fees.some((fee) => fee.key === key)) return;

    const nextFees = [...fees, createFee(key, `${newFeeName.trim()} %`, 0)];
    setFees(nextFees);
    setNewFeeName("");
    saveConfigToServer({ nextFees });
  };

  const removeFee = (feeId) => {
    const nextFees = fees.filter((fee) => fee.id !== feeId);
    setFees(nextFees);
    saveConfigToServer({ nextFees });
  };

  const updateGlobalCost = (costId, field, value) => {
    const nextGlobalCosts = globalCosts.map((item) =>
      item.id === costId ? { ...item, [field]: value } : item
    );
    setGlobalCosts(nextGlobalCosts);
    saveConfigToServer({ nextGlobalCosts });
  };

  const addGlobalCost = () => {
    if (!newCostName.trim()) return;

    const key = newCostName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
    if (globalCosts.some((item) => item.key === key)) return;

    const nextGlobalCosts = [...globalCosts, createGlobalCost(key, newCostName.trim(), 0)];
    setGlobalCosts(nextGlobalCosts);
    setNewCostName("");
    saveConfigToServer({ nextGlobalCosts });
  };

  const removeGlobalCost = (costId) => {
    const nextGlobalCosts = globalCosts.filter((item) => item.id !== costId);
    setGlobalCosts(nextGlobalCosts);
    saveConfigToServer({ nextGlobalCosts });
  };

  const updateModelField = (modelId, field, value) => {
    const nextModels = models.map((model) =>
      model.id === modelId ? { ...model, [field]: value } : model
    );
    setModels(nextModels);
    saveConfigToServer({ nextModels });
  };

  const addModel = () => {
    const baseModel = { id: makeId(), name: "New Model", extras: 0, image: "" };
    categories.forEach((category) => {
      baseModel[category.key] = category.options[0]?.id || "";
    });

    const nextModels = [...models, baseModel];
    setModels(nextModels);
    saveConfigToServer({ nextModels });
  };

  const addQuoteAsModel = () => {
    const newModel = createModel({
      name: quoteDraft.name?.trim() || `Quote ${models.length + 1}`,
      extras: Number(quoteDraft.extras || 0),
      image: quoteDraft.image || "",
      ...Object.fromEntries(categories.map((category) => [category.key, quoteDraft[category.key] || ""])),
    });

    const nextModels = [...models, newModel];
    setModels(nextModels);
    saveConfigToServer({ nextModels });
    setSaveMessage("Quote added as model");
    setTimeout(() => setSaveMessage(""), 1800);
  };

  const removeModel = (modelId) => {
    const nextModels = models.filter((model) => model.id !== modelId);
    setModels(nextModels);
    saveConfigToServer({ nextModels });
  };

  const handleImageUpload = (modelId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextModels = models.map((model) =>
        model.id === modelId ? { ...model, image: reader.result } : model
      );
      setModels(nextModels);
      saveConfigToServer({ nextModels });
    };
    reader.readAsDataURL(file);
  };

  const handleQuoteField = (field, value) => {
    setQuoteDraft((prev) => ({ ...prev, [field]: value }));
  };

  const resetQuote = () => {
    setQuoteDraft(buildEmptyQuote(categories));
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f3ff" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1rem" }}>
          <div style={{ border: "1px solid #ddd6fe", backgroundColor: "white", padding: "2rem", borderRadius: "10px", boxShadow: "0 1px 4px rgba(109,40,217,0.08)" }}>
            Loading config...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f3ff" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "3rem 1rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: 300, letterSpacing: "-0.025em", color: "#18112e", margin: 0 }}>
              Twelf
            </h1>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a394c7", marginTop: "0.25rem" }}>
              Price Calculator / New Singulars&apos;s Creator
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", borderBottom: "1px solid #ddd6fe", paddingBottom: "0", alignItems: "center" }}>
            <NavButton active={view === "results"} onClick={() => setView("results")}>📊 Results</NavButton>
            <NavButton active={view === "quote"} onClick={() => setView("quote")}>🧾 Quote Creator</NavButton>
            <NavButton active={view === "fees"} onClick={() => setView("fees")}>💰 Fees & Costs</NavButton>
            <NavButton active={view === "components"} onClick={() => setView("components")}>🔧 Components</NavButton>
            <NavButton active={view === "models"} onClick={() => setView("models")}>🖥️ Models</NavButton>

            <div style={{ marginLeft: "auto", fontSize: "0.875rem", fontWeight: 600 }}>
              {saving ? (
                <span style={{ color: "#7c3aed" }}>Saving...</span>
              ) : saveMessage === "Saved" ? (
                <span style={{ color: "#16a34a" }}>✓ Saved</span>
              ) : saveMessage === "Save failed" ? (
                <span style={{ color: "#dc2626" }}>⚠ Save failed</span>
              ) : saveMessage ? (
                <span style={{ color: "#5b21b6" }}>{saveMessage}</span>
              ) : null}
            </div>
          </div>

          {loadError ? (
            <div style={{ marginTop: "1rem", border: "1px solid #fcd34d", backgroundColor: "#fffbeb", color: "#92400e", padding: "0.75rem 1rem", borderRadius: "6px" }}>
              {loadError}
            </div>
          ) : null}
        </div>

        {view === "results" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
              {fees.slice(0, 3).map((fee) => (
                <StatCard key={fee.id} label={fee.label} value={`${fee.value}%`} />
              ))}
              <StatCard label="Target Margin" value={`${globalCostMap.targetMargin || 0}%`} />
            </div>

            <div style={{ overflow: "hidden", border: "1px solid #ddd6fe", backgroundColor: "white", boxShadow: "0 2px 8px rgba(109,40,217,0.08)", borderRadius: "10px" }}>
              <div
                style={{
                  borderBottom: "1px solid #ddd6fe",
                  backgroundColor: "#f5f3ff",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "#4c1d95",
                    margin: 0,
                  }}
                >
                  Pricing Matrix
                </h2>

                <button onClick={exportPricingMatrix} style={secondaryButtonStyle}>
                  Export CSV
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", fontSize: "0.875rem", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #ede9fe", backgroundColor: "#faf8ff" }}>
                      <th style={tableHeadLeft}>Model</th>
                      <th style={tableHeadRight}>Base Cost</th>
                      {fees.map((fee) => (
                        <th key={fee.id} style={tableHeadRight}>
                          {fee.label.replace(" Fee %", "")}
                        </th>
                      ))}
                      <th style={tableHeadRight}>Max Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {computedModels.map((model) => {
                      const maxProfit = Math.max(...model.storePrices.map((store) => store.profit));

                      return (
                        <tr
                          key={model.id}
                          style={{ borderBottom: "1px solid #ede9fe", transition: "background 150ms" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#faf8ff")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "#18112e" }}>{model.name}</td>

                          <td style={tableMoneyCellMuted}>${model.baseCost.toFixed(2)}</td>

                          {model.storePrices.map((store) => (
                            <td key={store.id} style={tableMoneyCell}>
                              ${store.value.toFixed(2)}
                            </td>
                          ))}

                          <td style={{ ...tableMoneyCell, color: "#16a34a" }}>
                            ${maxProfit.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#5b21b6" }}>
                Product Catalog
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {computedModels.map((model) => (
                  <div key={model.id} style={catalogCardStyle}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(109,40,217,0.15)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.borderColor = "#c4b5fd"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(109,40,217,0.07)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#ddd6fe"; }}
                  >
                    <div style={{ aspectRatio: "4/3", width: "100%", overflow: "hidden", backgroundColor: "#f5f3ff" }}>
                      {model.image ? (
                        <img
                          src={model.image}
                          alt={model.name}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "contain",
                            backgroundColor: "#f5f3ff",
                            padding: "0.75rem",
                          }}
                        />
                      ) : (
                        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "3rem" }}>🖥️</span>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#18112e", margin: 0 }}>{model.name}</h3>
                        <p style={{ marginTop: "0.25rem", fontSize: "0.8rem", color: "#7c6fa0" }}>
                          {model.displayValues.cpu} · {model.displayValues.gpu}
                        </p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid #ede9fe", paddingTop: "1rem" }}>
                        <PriceLine label="Base Cost" value={model.baseCost} muted />
                        {model.storePrices.map((store) => (
                          <PriceLine key={store.id} label={store.label} value={store.value} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "quote" && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.1fr) minmax(320px, 0.9fr)", gap: "1.5rem" }}>
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <h2 style={panelTitleStyle}>🧾 Quote Creator</h2>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <button onClick={resetQuote} style={secondaryButtonStyle}>Reset</button>
                  <button onClick={addQuoteAsModel} style={primaryButtonStyle}>Add as Model</button>
                </div>
              </div>

              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={labelStyle}>Quote Name</label>
                    <input
                      value={quoteDraft.name}
                      onChange={(e) => handleQuoteField("name", e.target.value)}
                      style={inputStyleFull}
                      placeholder="Custom client quote"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Extras</label>
                    <input
                      type="number"
                      value={quoteDraft.extras}
                      onChange={(e) => handleQuoteField("extras", e.target.value)}
                      style={inputStyleFull}
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    value={quoteDraft.notes}
                    onChange={(e) => handleQuoteField("notes", e.target.value)}
                    placeholder="Optional notes for this quote"
                    style={textareaStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
                  {categories.map((category) => (
                    <div key={category.id}>
                      <label style={labelStyle}>{category.label}</label>
                      <select
                        value={quoteDraft[category.key] || ""}
                        onChange={(e) => handleQuoteField(category.key, e.target.value)}
                        style={selectStyle}
                      >
                        {category.options.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name} (${Number(option.price || 0).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={panelStyle}>
                <div style={panelHeaderStyle}>
                  <h2 style={panelTitleStyle}>Quote Summary</h2>
                  <button onClick={exportQuoteToCsv} style={secondaryButtonStyle}>Export CSV</button>
                </div>

                <div style={{ padding: "1.5rem" }}>
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#18112e" }}>{computedQuote.name || "Custom Quote"}</div>
                    <div style={{ marginTop: "0.25rem", color: "#7c6fa0", fontSize: "0.875rem" }}>
                      {computedQuote.displayValues.cpu} · {computedQuote.displayValues.gpu}
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #ede9fe", borderBottom: "1px solid #ede9fe", padding: "1rem 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {computedQuote.partsBreakdown.map((part) => (
                      <div key={part.key} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontSize: "0.875rem" }}>
                        <div>
                          <div style={{ color: "#18112e", fontWeight: 600 }}>{part.label}</div>
                          <div style={{ color: "#7c6fa0" }}>{part.optionName}</div>
                        </div>
                        <div style={{ fontFamily: "monospace", color: "#5b21b6", fontWeight: 700 }}>
                          ${part.price.toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", paddingTop: "0.5rem", borderTop: "1px dashed #ddd6fe" }}>
                      <span style={{ color: "#18112e" }}>Extras</span>
                      <span style={{ fontFamily: "monospace", color: "#5b21b6", fontWeight: 700 }}>
                        ${Number(computedQuote.extras || 0).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                      <span style={{ color: "#18112e" }}>Labor</span>
                      <span style={{ fontFamily: "monospace", color: "#5b21b6", fontWeight: 700 }}>
                        ${Number(globalCostMap.labor || 0).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                      <span style={{ color: "#18112e" }}>Shipping Inbound</span>
                      <span style={{ fontFamily: "monospace", color: "#5b21b6", fontWeight: 700 }}>
                        ${Number(globalCostMap.shippingInbound || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7c6fa0" }}>Base Cost</span>
                    <span style={{ fontSize: "1.6rem", fontFamily: "monospace", color: "#18112e", fontWeight: 700 }}>
                      ${Number(computedQuote.baseCost || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={panelStyle}>
                <div style={panelHeaderStyle}>
                  <h2 style={panelTitleStyle}>Suggested Prices</h2>
                </div>
                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {computedQuote.storePrices.map((store) => (
                    <div key={store.id} style={{ border: "1px solid #ede9fe", borderRadius: "8px", padding: "1rem", backgroundColor: "#faf8ff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontWeight: 700, color: "#18112e" }}>{store.label}</span>
                        <span style={{ fontFamily: "monospace", color: "#5b21b6", fontWeight: 700 }}>${store.value.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.8125rem", color: "#7c6fa0" }}>
                        <span>Fee: ${store.feeAmount.toFixed(2)}</span>
                        <span style={{ textAlign: "right", color: "#16a34a", fontWeight: 700 }}>
                          Profit: ${store.profit.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "fees" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <h2 style={panelTitleStyle}>💳 Store Fees</h2>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input value={newFeeName} onChange={(e) => setNewFeeName(e.target.value)} placeholder="Fee name" style={inputStyle} />
                  <button onClick={addFee} style={primaryButtonStyle}>Add</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", backgroundColor: "#ede9fe" }}>
                {fees.map((fee) => (
                  <div key={fee.id} style={{ backgroundColor: "white", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Label</label>
                      <input value={fee.label} onChange={(e) => updateFee(fee.id, "label", e.target.value)} style={inputStyleFull} />
                    </div>
                    <div>
                      <label style={labelStyle}>Value</label>
                      <input type="number" value={fee.value} onChange={(e) => updateFee(fee.id, "value", e.target.value)} style={inputStyleFull} />
                    </div>
                    <button onClick={() => removeFee(fee.id)} style={deleteButtonStyle}>Delete</button>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <h2 style={panelTitleStyle}>🌍 Global Costs</h2>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input value={newCostName} onChange={(e) => setNewCostName(e.target.value)} placeholder="Cost name" style={inputStyle} />
                  <button onClick={addGlobalCost} style={primaryButtonStyle}>Add</button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", backgroundColor: "#ede9fe" }}>
                {globalCosts.map((item) => (
                  <div key={item.id} style={{ backgroundColor: "white", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={labelStyle}>Label</label>
                      <input value={item.label} onChange={(e) => updateGlobalCost(item.id, "label", e.target.value)} style={inputStyleFull} />
                    </div>
                    <div>
                      <label style={labelStyle}>Value</label>
                      <input type="number" value={item.value} onChange={(e) => updateGlobalCost(item.id, "value", e.target.value)} style={inputStyleFull} />
                    </div>
                    <button onClick={() => removeGlobalCost(item.id)} style={deleteButtonStyle}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "components" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={panelStyle}>
              <div style={panelHeaderStyle}>
                <h2 style={panelTitleStyle}>🔧 Component Categories</h2>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <input value={newCategoryLabel} onChange={(e) => setNewCategoryLabel(e.target.value)} placeholder="Category name" style={inputStyle} />
                  <button onClick={addCategory} style={primaryButtonStyle}>Add</button>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
              {categories.map((category) => (
                <div key={category.id} style={panelStyle}>
                  <div style={panelHeaderStyle}>
                    <input
                      value={category.label}
                      onChange={(e) => updateCategoryLabel(category.id, e.target.value)}
                      style={{ ...inputStyle, borderBottom: "2px solid transparent", fontWeight: 700, paddingLeft: 0, paddingRight: 0, color: "#18112e" }}
                    />
                    <button onClick={() => removeCategory(category.key)} style={deleteButtonStyle}>Delete</button>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    {category.options.map((option, index) => (
                      <div key={option.id} style={{ padding: "1rem 0", borderTop: index === 0 ? "none" : "1px solid #ede9fe" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                          <div>
                            <label style={labelStyle}>Name</label>
                            <input value={option.name} onChange={(e) => updateOption(category.id, option.id, "name", e.target.value)} style={inputStyleFull} />
                          </div>
                          <div>
                            <label style={labelStyle}>Price</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <input type="number" value={option.price} onChange={(e) => updateOption(category.id, option.id, "price", e.target.value)} style={{ ...inputStyleFull, flex: 1 }} />
                              <button onClick={() => removeOption(category.id, option.id)} style={{ border: "none", background: "none", color: "#c4b5fd", fontSize: "1.25rem", cursor: "pointer", transition: "color 150ms" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#dc2626"}
                                onMouseLeave={e => e.currentTarget.style.color = "#c4b5fd"}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </div>
                        {getAvailableScores(option).length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem", marginTop: "0.625rem" }}>
                            {getAvailableScores(option).map((score) => (
                              <div key={score.field}>
                                <label style={labelStyle}>{formatScoreLabel(score.field)}</label>
                                <input
                                  type="number"
                                  value={score.value}
                                  onChange={(e) => updateOptionScore(category, option.id, score.field, e.target.value)}
                                  style={inputStyleFull}
                                />
                              </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.625rem" }}>
                            {getAvailableScores(option).map((score) => (
                              <span key={score.field} style={{ fontSize: "0.7rem", color: "#5b21b6", backgroundColor: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "999px", padding: "0.125rem 0.5rem" }}>
                                {formatScoreLabel(score.field)}: {score.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: "1px solid #ede9fe", padding: "0.75rem 1.5rem" }}>
                    <button onClick={() => addOption(category.id)} style={{ border: "none", background: "none", color: "#7c3aed", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem", transition: "color 150ms" }}
                      onMouseEnter={e => e.currentTarget.style.color = "#5b21b6"}
                      onMouseLeave={e => e.currentTarget.style.color = "#7c3aed"}
                    >
                      + Add Option
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "models" && (
          <div style={panelStyle}>
            <div style={panelHeaderStyle}>
              <h2 style={panelTitleStyle}>🖥️ PC Models</h2>
              <button onClick={addModel} style={primaryButtonStyle}>Add Model</button>
            </div>

            <div>
              {models.map((model, index) => (
                <div key={model.id} style={{ padding: "1.5rem", borderTop: index === 0 ? "none" : "1px solid #ede9fe", transition: "background 150ms" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#faf8ff"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                    <input
                      value={model.name}
                      onChange={(e) => updateModelField(model.id, "name", e.target.value)}
                      style={{ ...inputStyle, borderBottom: "2px solid transparent", fontSize: "1.125rem", fontWeight: 700, paddingLeft: 0, paddingRight: 0, color: "#18112e" }}
                    />
                    <button onClick={() => removeModel(model.id)} style={deleteButtonStyle}>Delete</button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
                    {categories.map((category) => (
                      <div key={category.id}>
                        <label style={labelStyle}>{category.label}</label>
                        <select value={model[category.key] || ""} onChange={(e) => updateModelField(model.id, category.key, e.target.value)} style={selectStyle}>
                          {category.options.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}

                    <div>
                      <label style={labelStyle}>Extras</label>
                      <input type="number" value={model.extras} onChange={(e) => updateModelField(model.id, "extras", e.target.value)} style={inputStyleFull} />
                    </div>
                  </div>
                  {getAvailableScores(model).length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.875rem" }}>
                      {getAvailableScores(model).map((score) => (
                        <span key={score.field} style={{ fontSize: "0.7rem", color: "#5b21b6", backgroundColor: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: "999px", padding: "0.125rem 0.5rem" }}>
                          {formatScoreLabel(score.field)}: {score.value}
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: "1.5rem" }}>
                    <label style={labelStyle}>Product Image</label>

                    <label style={uploadButtonStyle}>
                      <span>{model.image ? "Change image" : "Upload image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(model.id, e.target.files?.[0])}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function migrateQuoteDraft(currentDraft, categories) {
  const nextDraft = currentDraft ? { ...currentDraft } : buildEmptyQuote(categories);

  categories.forEach((category) => {
    const optionIds = new Set(category.options.map((opt) => opt.id));
    if (!nextDraft[category.key] || !optionIds.has(nextDraft[category.key])) {
      nextDraft[category.key] = category.options[0]?.id || "";
    }
  });

  if (typeof nextDraft.name !== "string") nextDraft.name = "Custom Quote";
  if (nextDraft.extras === undefined || nextDraft.extras === null) nextDraft.extras = 0;
  if (typeof nextDraft.notes !== "string") nextDraft.notes = "";
  if (typeof nextDraft.image !== "string") nextDraft.image = "";

  return nextDraft;
}

function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const inputStyle = {
  border: "none",
  borderBottom: "2px solid #ddd6fe",
  backgroundColor: "transparent",
  padding: "0.5rem",
  fontSize: "0.875rem",
  color: "#18112e",
  outline: "none",
};

const inputStyleFull = {
  width: "100%",
  border: "none",
  borderBottom: "2px solid #ddd6fe",
  backgroundColor: "transparent",
  padding: "0.5rem 0",
  fontSize: "0.875rem",
  color: "#18112e",
  outline: "none",
};

const textareaStyle = {
  width: "100%",
  minHeight: "90px",
  border: "1px solid #ddd6fe",
  borderRadius: "8px",
  backgroundColor: "#faf8ff",
  padding: "0.875rem 1rem",
  fontSize: "0.875rem",
  color: "#18112e",
  outline: "none",
  resize: "vertical",
  boxSizing: "border-box",
};

const selectStyle = {
  width: "100%",
  border: "none",
  borderBottom: "2px solid #ddd6fe",
  backgroundColor: "transparent",
  padding: "0.5rem 0",
  fontSize: "0.875rem",
  color: "#18112e",
  outline: "none",
};

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.7rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#7c6fa0",
};

const primaryButtonStyle = {
  backgroundColor: "#7c3aed",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "0.625rem 1.25rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 150ms, box-shadow 150ms, transform 150ms",
};

const secondaryButtonStyle = {
  backgroundColor: "white",
  color: "#5b21b6",
  border: "1.5px solid #c4b5fd",
  borderRadius: "6px",
  padding: "0.625rem 1rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  cursor: "pointer",
};

const uploadButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "42px",
  padding: "0.75rem 1rem",
  border: "1.5px dashed #c4b5fd",
  borderRadius: "6px",
  backgroundColor: "#f5f3ff",
  color: "#6d28d9",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const deleteButtonStyle = {
  border: "none",
  background: "none",
  color: "#a394c7",
  fontSize: "0.875rem",
  fontWeight: 600,
  cursor: "pointer",
  transition: "color 150ms",
};

const panelStyle = {
  border: "1px solid #ddd6fe",
  backgroundColor: "white",
  boxShadow: "0 2px 8px rgba(109,40,217,0.08)",
  borderRadius: "10px",
  overflow: "hidden",
};

const panelHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid #ddd6fe",
  backgroundColor: "#f5f3ff",
  padding: "1rem 1.5rem",
  gap: "1rem",
  flexWrap: "wrap",
};

const panelTitleStyle = {
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#4c1d95",
  margin: 0,
};

const catalogCardStyle = {
  overflow: "hidden",
  border: "1px solid #ddd6fe",
  backgroundColor: "white",
  boxShadow: "0 2px 8px rgba(109,40,217,0.07)",
  borderRadius: "10px",
  transition: "box-shadow 180ms, transform 180ms, border-color 180ms",
};

const tableHeadLeft = {
  padding: "0.75rem 1.5rem",
  textAlign: "left",
  fontWeight: 700,
  color: "#4c1d95",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const tableHeadRight = {
  padding: "0.75rem 1.5rem",
  textAlign: "right",
  fontWeight: 700,
  color: "#4c1d95",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

const tableMoneyCell = {
  padding: "1rem 1.5rem",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
  fontWeight: 700,
  color: "#18112e",
  fontFamily: "monospace",
};

const tableMoneyCellMuted = {
  padding: "1rem 1.5rem",
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
  color: "#5b21b6",
  fontFamily: "monospace",
};

function NavButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "0.5rem 1rem",
        fontSize: "0.75rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        transition: "all 0.2s",
        border: "none",
        background: "none",
        cursor: "pointer",
        borderBottom: active ? "2px solid #7c3aed" : "2px solid transparent",
        color: active ? "#18112e" : "#a394c7",
      }}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      border: "1px solid #ddd6fe",
      backgroundColor: "white",
      padding: "1.5rem",
      boxShadow: "0 2px 8px rgba(109,40,217,0.07)",
      borderRadius: "10px",
      position: "relative",
      overflow: "hidden",
      transition: "box-shadow 180ms, border-color 180ms",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: "linear-gradient(90deg, #7c3aed, #c4b5fd)",
      }} />
      <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7c6fa0" }}>{label}</div>
      <div style={{ marginTop: "0.5rem", fontSize: "1.875rem", fontWeight: 300, fontVariantNumeric: "tabular-nums", color: "#18112e", letterSpacing: "-0.02em" }}>{value}</div>
    </div>
  );
}

function PriceLine({ label, value, muted = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", fontSize: "0.875rem" }}>
      <span style={{ color: muted ? "#7c6fa0" : "#18112e", fontWeight: muted ? 400 : 600 }}>{label}</span>
      <span style={{ fontVariantNumeric: "tabular-nums", fontFamily: "monospace", color: muted ? "#7c6fa0" : "#7c3aed", fontWeight: muted ? 400 : 700 }}>
        ${Number(value || 0).toFixed(2)}
      </span>
    </div>
  );
}
