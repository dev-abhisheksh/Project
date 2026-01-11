const MODEL_NAME = "gemini-2.5-flash-lite";
const API_VERSION = "v1beta";

const GEMINI_URL = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL_NAME}:generateContent`;

export const moderateText = async (text) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 800);

    try {
        const response = await fetch(
            `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `
You are a strict content moderation system.

If the text contains ANY:
- profanity
- sexual language
- hate speech
- slurs
- abusive language

Return ONLY one word:
BLOCK or ALLOW

TEXT:
"${text}"
`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const output =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.toUpperCase() || "ALLOW";

        return output.includes("BLOCK") ? "BLOCK" : "ALLOW";
    } catch (err) {
        return "ALLOW";
    } finally {
        clearTimeout(timeout);
    }
};
