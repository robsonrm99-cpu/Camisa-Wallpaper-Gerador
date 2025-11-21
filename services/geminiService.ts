import { GoogleGenAI, Modality } from "@google/genai";
import { WallpaperParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash-image';
const IMAGEN_MODEL = 'imagen-4.0-generate-001';

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  const isMobile = params.aspectRatio === '9:16';
  
  const ratioText = isMobile ? "vertical 9:16" : "horizontal 16:9";
  
  // Unified Gender Logic: Defines silhouette and fit based on selection
  const genderContext = params.genero === 'feminino'
    ? "FEMININE PLAYER BACK VIEW. Silhouette must be female (tapered waist, narrower shoulders, women's kit fit). Hairstyle: Ponytail, bun, or long hair visible."
    : "MASCULINE PLAYER BACK VIEW. Silhouette must be male (broad shoulders, straight waist, men's kit fit). Hairstyle: Short or faded.";

  // Strict Logo Logic
  const logoInstruction = hasLogo
    ? "A CUSTOM CLUB LOGO IS PROVIDED. You MUST incorporate this logo design on the jersey (nape or upper back). MAINTAIN ITS EXACT COLORS AND SHAPE. Do not distort it."
    : "NO LOGO PROVIDED. Create a generic, artistic crest shape on the nape. Do not use real text inside it.";

  // Strict Color Logic
  const colorContext = `STRICT COLOR RULE: The jersey and background MUST use the OFFICIAL COLORS of the club "${params.clube}". If the club is Palmeiras, use Green/White. If Flamengo, Red/Black. If Barcelona, Blue/Red/Yellow. DO NOT DEVIATE from the club's official palette to generic colors.`;

  return `
You are generating a ${ratioText} illustrated football wallpaper.

TASK: Create a high-quality sports illustration of a football player from the BACK view.

PARAMETERS:
- CLUB IDENTITY: ${params.clube}
- PLAYER NAME: ${params.nome}
- NUMBER: ${params.numero}
- GENDER: ${params.genero}
- FORMAT: ${ratioText}

GUIDELINES:
1. ${colorContext}
2. ${genderContext}
3. NAME & NUMBER: Render "${params.nome}" (Name) and "${params.numero}" (Number) clearly on the back of the shirt. Font should be bold, sports-style.
4. STYLE: Modern digital art, dynamic brushwork, slight texture. NOT a photo.
5. COMPOSITION: Player centered, taking up 65% of the frame. Background is an abstract stadium atmosphere using club colors.
6. LOGO: ${logoInstruction}

PROHIBITED:
- Wrong club colors (Critical).
- Text other than name/number.
- Front view.
- Photorealism (keep it artistic).
- Distorted faces (since it is back view, no face should be visible).
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
        // We reinforce the aspect ratio in the text as well.
        const parts: any[] = [{ text: prompt }];

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
                text: `Edit this football wallpaper. Instruction: ${instruction}. Keep the original club colors and player name/number if not asked to change.`
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