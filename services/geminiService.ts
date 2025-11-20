import { GoogleGenAI, Modality } from "@google/genai";
import { WallpaperParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  const isMobile = params.aspectRatio === '9:16';
  
  const orientation = isMobile ? "vertical" : "horizontal";
  // Use descriptive terms instead of numbers to prevent text leakage
  const ratioDesc = isMobile ? "Portrait Mode (Tall)" : "Cinematic Mode (Wide)"; 
  const compType = isMobile ? "mobile wallpaper" : "desktop wallpaper";
  const composition = isMobile ? "Maintain vertical composition" : "Maintain horizontal cinematic composition";

  const crestInstruction = hasLogo
    ? "Below the number, place the club crest. A reference image is provided; try to incorporate this logo design clearly on the back of the jersey or as a central element below the number."
    : "Below the number, place a symbolic crest inspired by the club (NOT the real crest).";

  const prohibitedSection = hasLogo
    ? "No photorealistic jersey.\nNo real player face.\nNo neon overload."
    : "No photorealistic jersey.\nNo real club crest.\nNo real player face.\nNo neon overload.";

  // REMOVED specific numbers (9:16/16:9) from the prohibited text because mentioning them can cause the model to print them.
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

export const generateWallpaper = async (params: WallpaperParams): Promise<string> => {
  try {
    const prompt = constructPrompt(params);

    // STRATEGY:
    // 1. Use Imagen 4.0 if NO logo is provided. It respects `aspectRatio` config strictly.
    // 2. Use Gemini 2.5 Flash Image if a LOGO IS provided. It supports image input (multimodal).

    if (!params.logoBase64) {
        const response = await ai.models.generateImages({
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
    } else {
        // Use Gemini 2.5 Flash Image for Multimodal (Text + Image Logo)
        // We must reinforce the aspect ratio in the prompt as config is not fully supported for generateContent aspect ratio
        // We avoid using numbers like "9:16" in the text to prevent them from appearing in the image.
        const ratioInstruction = params.aspectRatio === '9:16' 
            ? "OUTPUT IMAGE MUST BE VERTICAL (TALL FORMAT)." 
            : "OUTPUT IMAGE MUST BE HORIZONTAL (WIDE FORMAT).";

        const parts: any[] = [{ text: `${prompt}\n\nCRITICAL LAYOUT: ${ratioInstruction}` }];

        parts.push({
            inlineData: {
              mimeType: params.logoMimeType || 'image/png',
              data: params.logoBase64
            }
        });

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: {
            parts: parts
          },
          config: {
            responseModalities: [Modality.IMAGE],
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
        throw new Error("No image data received from Gemini.");
    }
  } catch (error) {
    console.error("Error generating wallpaper:", error);
    throw error;
  }
};

export const editWallpaper = async (currentImageBase64: string, instruction: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: [
            {
                text: instruction
            },
            {
                inlineData: {
                    mimeType: 'image/png',
                    data: currentImageBase64
                }
            }
        ]
      },
      config: {
        responseModalities: [Modality.IMAGE],
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
    
    throw new Error("No image data received from Gemini.");
  } catch (error) {
    console.error("Error editing wallpaper:", error);
    throw error;
  }
};