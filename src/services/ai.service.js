// ai.service.js - All AI helper functions in one file

const MODEL_NAME = "gemini-2.5-flash-lite";
const API_VERSION = "v1beta";

// ===================== TEXT ENHANCEMENT =====================
export const textEnhancementService = async ({ text, purpose }) => {
    const prompt = `
Improve the following text for ${purpose}.
Fix grammar, clarity, and sentence flow.
Do NOT change meaning. Do NOT add new information.
Return ONLY the improved text.

Text:
${text}
`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 500
                }
            })
        }
    );

    if (!res.ok) {
        throw new Error(`Gemini API failed: ${res.status}`);
    }

    const data = await res.json();
    const improvedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!improvedText) {
        throw new Error("Gemini returned empty enhanced text");
    }

    // ✅ RETURN OBJECT, NOT STRING
    return { enhancedText: improvedText.trim() };
};

// ===================== CATEGORY GENERATION =====================
export const generateCategoryWithAi = async ({ title, description }) => {
    const prompt = `
You are a dual-category classifier. Analyze the problem and return TWO categories in JSON format:

1. "specificCategory": Choose EXACTLY ONE from the specific categories list
2. "broadCategory": Choose EXACTLY ONE from the broad categories list

SPECIFIC CATEGORIES (detailed):
water conservation, food waste, energy efficiency, waste management,
sustainable agriculture, air pollution, plastic reduction,
urban sustainability, climate awareness, eco-friendly living,
water scarcity, water pollution, food waste, food insecurity,
energy wastage, fossil dependence, plastic waste, poor segregation,
e-waste dumping, landfill overflow, air pollution, noise pollution,
urban flooding, traffic congestion, climate impacts, heatwaves,
soil degradation, crop wastage, chemical overuse, overconsumption,
single-use plastics, weak enforcement, low awareness

BROAD CATEGORIES (for expert matching):
water, energy, waste, food, agriculture, air, climate, urban, pollution, environment

Title: ${title}
Description: ${description}

Return ONLY a JSON object in this exact format:
{"specificCategory": "category name", "broadCategory": "category name"}
`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );

    if (!res.ok) {
        throw new Error(`Gemini API failed: ${res.status}`);
    }

    const data = await res.json();
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Gemini returned empty category response");
    }

    // Clean up JSON response (remove markdown code blocks if present)
    text = text.trim();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');

    try {
        const categories = JSON.parse(text);
        return {
            specificCategory: categories.specificCategory?.trim().toLowerCase() || "general",
            broadCategory: categories.broadCategory?.trim().toLowerCase() || "general"
        };
    } catch (error) {
        console.error("Failed to parse category JSON:", error);
        // Fallback to default categories
        return {
            specificCategory: "general",
            broadCategory: "environment"
        };
    }
};

// ===================== TAG GENERATION =====================
export const generateTagsWithAI = async ({ title, description, category }) => {
    const prompt = `
Generate 2–4 concrete, technical tags that BELONG to the given category.
Do NOT invent tags outside this category.
Avoid abstract or generic words.
Return ONLY a comma-separated list. No explanations.

Category: ${category}

Title: ${title}
Description: ${description}
`;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0,
                    maxOutputTokens: 30
                }
            })
        }
    );

    if (!res.ok) {
        throw new Error(`Gemini API failed: ${res.status}`);
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
        throw new Error("Gemini returned empty tags response");
    }

    return text
        .split(",")
        .map(t => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 4);
};