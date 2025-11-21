import { GoogleGenAI } from "@google/genai";
import { WallpaperParams } from "../types";

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  const isMobile = params.aspectRatio === '9:16';
  
  const orientation = isMobile ? "vertical" : "horizontal";
  const ratioStr = isMobile ? "9:16" : "16:9";

  // Specific logic for the unified Gender version
  const genderInstructions = params.genero === 'feminino'
    ? `FEMININE VERSION:
       - Player silhouette must be FEMALE (athletic, fitted jersey cut).
       - Hairstyle: Ponytail, bun, or braided hair visible from behind.
       - Posture: Strong, elegant, dynamic sport stance.
       - No sexualization, focus on professional athlete aesthetic.`
    : `MASCULINE VERSION:
       - Player silhouette must be MALE (broad shoulders, athletic build).
       - Hairstyle: Short fade or modern soccer player haircut.
       - Posture: Dominant, powerful, ready for action.`;

  const crestInstruction = hasLogo
    ? "CLUB LOGO: A reference image of the logo is provided. INTEGRATE this exact logo design on the back of the jersey or floating dramatically below the number."
    : "CLUB LOGO: Create a artistic, symbolic crest inspired by the club colors (do not generate text inside the crest, keep it abstract/geometric).";

  return `
You are generating a ${orientation} ${ratioStr} illustration.

TASK: Create a High-Quality Football Jersey Wallpaper (Back View).
TARGET ASPECT RATIO: ${ratioStr} (${orientation}).

USER PARAMETERS:
- CLUB: ${params.clube}
- NAME: ${params.nome} (Uppercase, Bold typography on Jersey)
- NUMBER: ${params.numero} (Large, Central typography on Jersey)
- GENDER: ${params.genero}

VISUAL STYLE:
- CONCEPT ART / DIGITAL ILLUSTRATION (Not a photo, not a 3D render).
- Art Style: Modern Sports Graphics, dynamic brush strokes, high contrast, dramatic lighting.
- Background: Abstract stadium atmosphere, club colors in smoke/neon/geometric patterns. Matches the ${params.clube} theme perfectly.

${genderInstructions}

COMPOSITION:
- View: FROM BEHIND (Back of the player).
- Subject: 1 Player centered.
- The Name "${params.nome}" must be clearly legible above the number.
- The Number "${params.numero}" must be the central focal point.
- ${crestInstruction}

STRICT CONSTRAINTS:
- DO NOT generate faces (player is facing away).
- DO NOT generate text other than "${params.nome}" and "${params.numero}".
- DO NOT generate watermarks or technical info.
- IMAGE MUST BE FULL BLEED ${ratioStr}.

MAKE IT EPIC.
`;
};

export const generateWallpaper = async (params: WallpaperParams): Promise<string> => {
  try {
    // Use the key from window.process (injected in index.html) or process.env
    // @ts-ignore
    const apiKey = (window.process?.env?.API_KEY) || process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing. Please check configuration.");

    const client = new GoogleGenAI({ apiKey });
    const prompt = constructPrompt(params);

    // Helper function to use Gemini 2.5 Flash Image
    const generateWithGemini = async () => {
        const parts: any[] = [{ text: prompt }];

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
          config: {
              // Gemini 2.5 Flash Image doesn't strictly support aspectRatio in config, 
              // so we rely heavily on the prompt instructions.
          }
        });

        const candidates = response.candidates;
        if (candidates && candidates[0]?.content?.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return part.inlineData.data;
                }
            }
            // If text returned (refusal or explanation)
             const textPart = candidates[0].content.parts.find(p => p.text);
             if (textPart) {
                 throw new Error(`Gemini Response: ${textPart.text.substring(0, 100)}...`);
             }
        }
        throw new Error("O modelo não retornou dados de imagem.");
    };

    // STRATEGY:
    // 1. If LOGO provided -> MUST use Gemini (Multimodal).
    // 2. If NO LOGO -> Try Imagen 4.0 (Better Prompt Adherence) -> Fallback to Gemini.

    if (params.logoBase64) {
        return await generateWithGemini();
    } else {
        try {
            const response = await client.models.generateImages({
                model: IMAGEN_MODEL,
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: params.aspectRatio, // Imagen supports strict aspect ratio
                    outputMimeType: 'image/jpeg',
                }
            });
            
            if (response.generatedImages?.[0]?.image?.imageBytes) {
                return response.generatedImages[0].image.imageBytes;
            }
            throw new Error("Imagen returned no data.");
        } catch (imagenError: any) {
            console.warn("Imagen failed, falling back to Gemini:", imagenError);
            return await generateWithGemini();
        }
    }

  } catch (error: any) {
    console.error("Error generating wallpaper:", error);
    const msg = error.toString().toLowerCase();
    if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
        throw new Error("Muitos acessos agora. Tente novamente em 30 segundos.");
    }
    throw error;
  }
};

export const editWallpaper = async (currentImageBase64: string, instruction: string): Promise<string> => {
  try {
    // @ts-ignore
    const apiKey = (window.process?.env?.API_KEY) || process.env.API_KEY;
    const client = new GoogleGenAI({ apiKey });
    
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
            { text: `EDIT INSTRUCTION: ${instruction}. Maintain the football jersey theme.` },
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
    
    throw new Error("Falha na edição da imagem.");
  } catch (error: any) {
    console.error("Error editing wallpaper:", error);
    throw error;
  }
};