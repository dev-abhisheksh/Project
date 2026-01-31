const MODEL_NAME = "gemini-2.5-flash-lite";
const API_VERSION = "v1beta";

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

    // 🚨 Handle rate limits / failures explicitly
    if (!res.ok) {
        throw new Error(`Gemini API failed: ${res.status}`);
    }

    const data = await res.json();

    const improvedText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!improvedText) {
        throw new Error("Gemini returned empty enhanced text");
    }

    return improvedText.trim();
};
