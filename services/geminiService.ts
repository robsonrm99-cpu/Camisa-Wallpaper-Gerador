import { GoogleGenAI } from "@google/genai";
import { WallpaperParams } from "../types";

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  const isMobile = params.aspectRatio === '9:16';
  
  const orientation = isMobile ? "vertical" : "horizontal";
  const ratioDesc = isMobile ? "Portrait Mode (Tall)" : "Cinematic Mode (Wide)"; 
  const compType = isMobile ? "mobile wallpaper" : "desktop wallpaper";
  const composition = isMobile ? "Maintain vertical composition" : "Maintain horizontal cinematic composition";

  const crestInstruction = hasLogo
    ? "Below the number, place the club crest. A reference image is provided; try to incorporate this logo design clearly on the back of the jersey or as a central element below the number."
    : "Below the number, place a generic symbolic crest inspired by the colors (NOT a real trademarked crest).";

  const prohibitedSection = hasLogo
    ? "No photorealistic jersey.\nNo real player face.\nNo neon overload."
    : "No photorealistic jersey.\nNo real club crest.\nNo real player face.\nNo neon overload.";

  const technicalProhibition = `Text indicating dimensions.\nAspect ratio numbers.\nWatermarks.\nTechnical specs.`;

  return `
You are generating a ${orientation} ${ratioDesc} illustrated football ${compType} inspired by the back of a personalized jersey.
CONCEPT ART / FAN ART ONLY.

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

export const generateWallpaper = async (params: WallpaperParams): Promise<string> => {
  try {
    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = constructPrompt(params);

    // Helper function to use Gemini 2.5 Flash Image
    // Used either as primary (if logo present) or fallback (if Imagen fails)
    const generateWithGemini = async () => {
        const ratioInstruction = params.aspectRatio === '9:16' 
            ? "OUTPUT IMAGE MUST BE VERTICAL (TALL FORMAT)." 
            : "OUTPUT IMAGE MUST BE HORIZONTAL (WIDE FORMAT).";

        const parts: any[] = [{ text: `${prompt}\n\nCRITICAL LAYOUT: ${ratioInstruction}` }];

        if (params.logoBase64) {
            parts.push({
                inlineData: {
                    mimeType: params.logoMimeType || 'image/png',
                    data: params.logoBase64
                }
            });
        }

        const response = await client.models.generateContent({
          model: GEMINI_MODEL,
          contents: { parts },
        });

        const candidates = response.candidates;
        if (candidates && candidates[0]?.content?.parts) {
            let textReason = '';
            for (const part of candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return part.inlineData.data;
                }
                if (part.text) {
                    textReason += part.text;
                }
            }
            if (textReason) {
                console.warn("Gemini returned text instead of image:", textReason);
                // If it's a refusal, it often starts with "I cannot..."
                throw new Error(`O modelo não pôde gerar a imagem. Motivo: ${textReason.substring(0, 150)}...`);
            }
        }
        throw new Error("O modelo não retornou dados de imagem (resposta vazia).");
    };

    // STRATEGY:
    // 1. If NO logo: Try Imagen 4.0 first. If it fails (e.g. Quota), Fallback to Gemini 2.5 Flash.
    // 2. If LOGO exists: Must use Gemini 2.5 Flash (Multimodal).

    if (!params.logoBase64) {
        try {
            const response = await client.models.generateImages({
                model: IMAGEN_MODEL,
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: params.aspectRatio,
                    outputMimeType: 'image/jpeg',
                }
            });
            
            if (response.generatedImages?.[0]?.image?.imageBytes) {
                return response.generatedImages[0].image.imageBytes;
            }
            throw new Error("No image data received from Imagen.");
        } catch (imagenError: any) {
            console.warn("Imagen 4.0 generation failed. Attempting fallback to Gemini 2.5 Flash.", imagenError);
            // Fallback to Gemini
            return await generateWithGemini();
        }
    } else {
        // Direct use of Gemini for Multimodal input
        return await generateWithGemini();
    }

  } catch (error: any) {
    console.error("Error generating wallpaper:", error);
    const msg = error.toString().toLowerCase();
    if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
        throw new Error("Cota de uso excedida temporariamente. Tente novamente em alguns instantes.");
    }
    // Re-throw nice messages
    throw error;
  }
};

export const editWallpaper = async (currentImageBase64: string, instruction: string): Promise<string> => {
  try {
    const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
            { text: instruction },
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: currentImageBase64
                }
            }
        ]
      }
    });

    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
    }
    
    throw new Error("O modelo não retornou a imagem editada.");
  } catch (error: any) {
    console.error("Error editing wallpaper:", error);
    const msg = error.toString().toLowerCase();
    if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
        throw new Error("Muitos pedidos simultâneos. Aguarde um momento.");
    }
    throw error;
  }
};