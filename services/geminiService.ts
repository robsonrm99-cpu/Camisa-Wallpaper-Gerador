import { GoogleGenAI, Modality } from "@google/genai";
import { WallpaperParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash-image';

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  
  // Enhanced Club Identity & Kit Logic
  const kitContext = `
CRITICAL VISUAL IDENTITY RULES:
1. IDENTIFY THE CLUB: Apply the CORRECT PATTERN for "${params.clube}".
   - If "Corinthians", "Atlético Mineiro", "Botafogo", "Santos": Use VERTICAL STRIPES (Black/White).
   - If "Flamengo", "Sport", "Vitória": Use HORIZONTAL HOOPS (Red/Black).
   - If "Palmeiras": Emerald Green (Geometric pattern).
   - If "São Paulo": White base with Red/White/Black chest stripes.
   - If "Grêmio": Blue/Black/White vertical stripes.
   - If "Fluminense": Green/Maroon vertical stripes.
   - If "Vasco": Black with White diagonal sash (or vice-versa).
   
2. COLORS: Use the EXACT official hex codes. Vibrant and Saturated.
`;

  // Enhanced Gender/Silhouette Logic - STYLIZED
  const genderContext = params.genero === 'feminino'
    ? "FEMALE FOOTBALL PLAYER BACK VIEW. Physique: Athletic, stylized hero proportions, ponytail hairstyle. Jersey fit: Tapered waist."
    : "MALE FOOTBALL PLAYER BACK VIEW. Physique: Muscular, broad shoulders (V-taper), modern haircut (fade).";

  // Enhanced Logo Logic
  const logoInstruction = hasLogo
    ? `A CUSTOM LOGO IMAGE IS PROVIDED. 
       ACTION: Place this logo on the NAPE (back of neck) OR as a large stylized watermark at the bottom.
       EXECUTION: Make it look like a printed vector graphic on the shirt.`
    : `NO CUSTOM LOGO. 
       ACTION: Create a stylized vector emblem shape on the nape of the neck.`;

  return `
GENERATE A HIGH-QUALITY DIGITAL VECTOR ILLUSTRATION (E-SPORTS POSTER STYLE).

STYLE REFERENCE:
- **Visual Style**: Modern Vector Art, Cel-Shaded, Comic Book Realism (similar to GTA loading screens or high-end sports marketing illustrations).
- **Rendering**: BOLD OUTLINES, flat shading with hard edges, vibrant saturated colors. **NOT** photorealistic. **NOT** 3D render.
- **Artistic Technique**: Digital painting, clean lines, ink splotches.

SUBJECT:
${genderContext}
Position: Facing away from camera (Back View).
Skin: Smooth vector coloring with sharp shadows (Cel-shading).

JERSEY DESIGN:
- NAME: "${params.nome}" (Font: Bold, Vectorized Sports Typography, White or contrasting color).
- NUMBER: "${params.numero}" (Font: Large, Blocky, with thick outline).
- KIT STYLE: Stylized vector version of "${params.clube}" kit.
${kitContext}

BACKGROUND:
- Abstract artistic background.
- Elements: Vertical paint streaks, grunge brush strokes, speed lines, geometric shards.
- Colors: Explosion of the club's primary colors contrasting with a dark slate/black canvas.

${logoInstruction}

TECHNICAL:
- Aspect Ratio: ${params.aspectRatio}
- Composition: Centered back view, powerful stance.
- Lighting: Dramatic Rim Light (Backlight) outlining the character.
`;
};

export const generateWallpaper = async (params: WallpaperParams): Promise<string> => {
  try {
    const prompt = constructPrompt(params);
    const parts: any[] = [{ text: prompt }];

    // Add logo if present
    if (params.logoBase64) {
      parts.push({
        inlineData: {
          mimeType: params.logoMimeType || 'image/png',
          data: params.logoBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: {
        parts: parts
      },
      config: {
        responseModalities: [Modality.IMAGE],
        imageConfig: {
            aspectRatio: params.aspectRatio,
        }
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
                text: `Edit this illustration. Instruction: "${instruction}". 
                MAINTAIN THE VECTOR/CARTOON ART STYLE. Do not convert to photo.
                Keep jersey design and text legible.`
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
    
    throw new Error("No image data received from Gemini during edit.");
  } catch (error) {
    console.error("Error editing wallpaper:", error);
    throw error;
  }
};