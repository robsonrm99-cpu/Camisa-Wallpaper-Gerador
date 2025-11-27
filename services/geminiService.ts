import { GoogleGenAI, Modality } from "@google/genai";
import { WallpaperParams } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const GEMINI_MODEL = 'gemini-2.5-flash-image';

// Helper to get specific kit details based on club name
const getClubKitRules = (clubName: string): string => {
  const club = clubName.toLowerCase();
  
  if (club.includes('corinthians')) return 'OFFICIAL KIT: White/Black. PATTERN: Vertical thin pinstripes (Black) on White base OR All Black with white details. FONT: White/Black blocky numbers.';
  if (club.includes('flamengo')) return 'OFFICIAL KIT: Red/Black. PATTERN: Thick Horizontal Hoops (Red and Black stripes). FONT: White or Gold bold numbers.';
  if (club.includes('palmeiras')) return 'OFFICIAL KIT: Emerald Green. PATTERN: Clean Green base with subtle geometric texture or white trim. FONT: White numbers.';
  if (club.includes('são paulo') || club.includes('sao paulo')) return 'OFFICIAL KIT: White base. DETAILS: On the back, usually clean white, red/black numbers. (Note: The chest stripes are on front, back is clean).';
  if (club.includes('grêmio') || club.includes('gremio')) return 'OFFICIAL KIT: Tricolor (Blue, Black, White). PATTERN: Vertical stripes (Blue center, Black sides, White thin separators).';
  if (club.includes('inter') && club.includes('nac')) return 'OFFICIAL KIT: Red base. PATTERN: Clean Red with White details. FONT: White.';
  if (club.includes('vasco')) return 'OFFICIAL KIT: Black base. PATTERN: White Diagonal Sash (Faixa Diagonal) - Note: Sash usually goes front to back. If unsure, use All Black with White Cross emblem.';
  if (club.includes('santos')) return 'OFFICIAL KIT: All White. PATTERN: Clean White base. FONT: Black numbers.';
  if (club.includes('botafogo')) return 'OFFICIAL KIT: Black/White. PATTERN: Vertical Stripes (Black and White). FONT: White/Black.';
  if (club.includes('fluminense')) return 'OFFICIAL KIT: Green/Maroon (Garnet). PATTERN: Vertical Stripes (Green and Maroon with thin White borders).';
  if (club.includes('cruzeiro')) return 'OFFICIAL KIT: Royal Blue. PATTERN: Clean Blue base with White details (Southern Cross stars).';
  if (club.includes('atlético mineiro') || club.includes('galo')) return 'OFFICIAL KIT: Black/White. PATTERN: Vertical Stripes (Black and White).';
  
  if (club.includes('real madrid')) return 'OFFICIAL KIT: All White. PATTERN: Clean White with Gold or Black trim.';
  if (club.includes('barcelona')) return 'OFFICIAL KIT: Blue/Red (Blaugrana). PATTERN: Vertical wide stripes.';
  if (club.includes('city')) return 'OFFICIAL KIT: Sky Blue. PATTERN: Clean Sky Blue base.';
  
  // Generic Fallback but enforcing team colors
  return `OFFICIAL KIT for '${clubName}'. USE THE REAL LIFE OFFICIAL PATTERN AND COLORS OF THIS TEAM.`;
};

const constructPrompt = (params: WallpaperParams): string => {
  const hasLogo = !!params.logoBase64;
  const kitRules = getClubKitRules(params.clube);

  // Enhanced Gender/Silhouette Logic
  const genderContext = params.genero === 'feminino'
    ? "FEMALE FOOTBALL PLAYER BACK VIEW. Physique: Athletic, fit, ponytail or bun hairstyle. Jersey fit: Women's cut (slightly tapered waist)."
    : "MALE FOOTBALL PLAYER BACK VIEW. Physique: Muscular, broad shoulders (V-shape back), modern fade haircut.";

  // Logo Logic - Strict Adherence
  const logoInstruction = hasLogo
    ? `**CUSTOM LOGO PROVIDED**: 
       - You MUST place the provided logo image on the shirt.
       - LOCATION: Center of the back (below the number) OR Nape of the neck.
       - STYLE: Integrate it as a high-quality print. DO NOT DISTORT the logo shape.`
    : `**NO CUSTOM LOGO**: 
       - DRAW THE OFFICIAL CREST/LOGO OF "${params.clube}". 
       - LOCATION: Nape of the neck (small) OR bottom hem watermark.
       - ACCURACY: Try to replicate the official shape and colors of the ${params.clube} crest exactly. Do not invent a generic shield.`;

  return `
GENERATE A MASTERPIECE FOOTBALL WALLPAPER.
STYLE: "E-Sports Vector Art" / "GTA Loading Screen Style".
RENDERING: High contrast, cel-shaded, vibrant colors, sharp vector lines.

SUBJECT:
${genderContext}
POSITION: Seen from behind (Back View). Camera close-up on the jersey upper back.

THE JERSEY (CRITICAL ACCURACY):
- TEAM: ${params.clube}
- ${kitRules}
- NAME: "${params.nome}" (Upper back, Font: Official Sports Sans-Serif, Bold, Contrast Color).
- NUMBER: "${params.numero}" (Center back, Large, Font: Blocky Sports Typography).
- TEXTURE: Visible fabric texture (mesh/polyester sheen) but rendered in vector style.

${logoInstruction}

BACKGROUND:
- Abstract, energetic background using the PRIMARY COLORS of ${params.clube}.
- Elements: Speed lines, splatter, geometric shapes. Dark vignette edges.

STRICT RULES:
1. DO NOT misspell the Name or Number.
2. DO NOT invent random colors. USE OFFICIAL CLUB COLORS.
3. IF A SPECIFIC PATTERN IS DEFINED (e.g., Stripes), USE IT.
4. Aspect Ratio: ${params.aspectRatio === '16:9' ? 'Wide Landscape' : 'Vertical Portrait 9:16'}.
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
                text: `Edit this image. Instruction: "${instruction}". 
                KEEP THE CLUB IDENTITY AND JERSEY COLORS. 
                Maintain the vector art style.`
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
