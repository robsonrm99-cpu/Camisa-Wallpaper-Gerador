import { GoogleGenAI } from "@google/genai";

export const config = {
    runtime: 'edge',
};

// Logic moved from frontend service to backend for security and structure
const constructPrompt = (params) => {
    const hasLogo = !!params.logoBase64;
    const isMobile = params.aspectRatio === '9:16';

    const orientation = isMobile ? "vertical" : "horizontal";
    const ratioDesc = isMobile ? "Portrait Mode (Tall)" : "Cinematic Mode (Wide)";
    const compType = isMobile ? "mobile wallpaper" : "desktop wallpaper";
    const composition = isMobile ? "Maintain vertical composition" : "Maintain horizontal cinematic composition";

    const crestInstruction = hasLogo
        ? "Below the number, place the club crest. A reference image is provided; try to incorporate this logo design clearly on the back of the jersey or as a central element below the number."
        : "Below the number, place a symbolic crest inspired by the club (NOT the real crest).";

    const prohibitedSection = hasLogo
        ? "No photorealistic jersey.\nNo real player face.\nNo neon overload."
        : "No photorealistic jersey.\nNo real club crest.\nNo real player face.\nNo neon overload.";

    const technicalProhibition = `Text indicating dimensions.\nAspect ratio numbers.\nWatermarks.\nTechnical specs.`;

    return `
You are generating a ${orientation} ${ratioDesc} illustrated football ${compType} inspired by the back of a personalized jersey.

Create a modern sports-art ${compType} showing the BACK VIEW of a football player.

GENDER OF PLAYER: ${params.genero} (options: "masculino" or "feminino")
NAME ON JERSEY: ${params.nome}
JERSEY NUMBER: ${params.numero}
CLUB THEME: ${params.clube}

STYLE RULES:
Use a clean illustrated sports style (not photorealistic).
Do NOT generate an actual photograph of a jersey.
Create an artistic wallpaper INSPIRED by the club’s shirt, not a direct replica.
Use the official club colors and stripe patterns, but in a creative interpretation.
${composition} and high contrast.
Use dynamic brush strokes, geometric bars, and textured backgrounds.
Player seen from behind, centered, athletic silhouette.
For feminine players: elegant and strong, no sexualization, optional tied hair.
For masculine players: athletic silhouette, short hair silhouette.
Large, bold editable number “${params.numero}” centered on the back.
Editable player name “${params.nome}” above the number in bold uppercase.
${crestInstruction}

BACKGROUND:
${orientation} ${compType} with ${ratioDesc}.
Geometric shapes, textured strokes, modern sports composition.
Keep it artistic, stylish, premium, and visually striking.

TEXT RULES:
The ONLY allowed text is the name "${params.nome}" and the number "${params.numero}".
DO NOT write any other text.
DO NOT write the aspect ratio or dimensions.

PROHIBITED:
${technicalProhibition}
${prohibitedSection}

OVERALL FEEL:
A premium football-art wallpaper inspired by the club ${params.clube}, customizable with the user’s name and number.
`;
};

export default async function handler(request) {
    if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const body = await request.json();
        
        const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "API Key missing" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        // --- MODE: EDIT EXISTING IMAGE ---
        if (body.mode === 'edit') {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: {
                    parts: [
                        { text: body.instruction },
                        { inlineData: { mimeType: 'image/png', data: body.currentImage } }
                    ]
                },
                config: {
                    responseModalities: ['IMAGE'],
                }
            });

            const imgData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!imgData) throw new Error("No image returned from edit.");

            return new Response(JSON.stringify({ image: imgData }), { status: 200 });
        }

        // --- MODE: CREATE NEW IMAGE ---
        const prompt = constructPrompt(body);

        if (!body.logoBase64) {
            // Strategy 1: No Logo -> Imagen 4.0 (Better adherence to prompt)
            const response = await ai.models.generateImages({
                model: "imagen-4.0-generate-001",
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: body.aspectRatio || "9:16",
                    outputMimeType: "image/jpeg",
                },
            });

            const imgData = response.generatedImages?.[0]?.image?.imageBytes;
            if (!imgData) throw new Error("No image returned from Imagen.");

            return new Response(JSON.stringify({ image: imgData }), { status: 200 });

        } else {
            // Strategy 2: With Logo -> Gemini 2.5 Flash (Multimodal)
            const ratioInstruction = body.aspectRatio === '9:16'
                ? "OUTPUT IMAGE MUST BE VERTICAL (TALL FORMAT)."
                : "OUTPUT IMAGE MUST BE HORIZONTAL (WIDE FORMAT).";

            const parts = [
                { text: `${prompt}\n\nCRITICAL LAYOUT: ${ratioInstruction}` },
                {
                    inlineData: {
                        mimeType: body.logoMimeType || 'image/png',
                        data: body.logoBase64
                    }
                }
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts },
                config: {
                    responseModalities: ['IMAGE'],
                }
            });

            const imgData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!imgData) throw new Error("No image returned from Gemini.");

            return new Response(JSON.stringify({ image: imgData }), { status: 200 });
        }

    } catch (error) {
        console.error("API Error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Internal Server Error" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}