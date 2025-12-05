import { GoogleGenAI, Part } from "@google/genai";
import { BannerFormData, BannerStyle } from "../types";

const fileToPart = (file: File): Promise<Part> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const getStyleDescription = (style: BannerStyle): string => {
  const prefix = "STYLE: JDES ACADEMY - ";
  
  switch (style) {
    case BannerStyle.JDES_ACADEMY:
      return prefix + "Padrão Oficial. Fundo azul escuro profundo, linhas geométricas douradas finas. Visual limpo.";
    case BannerStyle.CHAMPIONS_PRO:
      return prefix + "Champions League Vibe. Tons de roxo e azul royal, estrelas brilhantes no fundo.";
    case BannerStyle.COPA_ULTRA:
      return prefix + "World Cup Gold. Fundo dourado luxuoso, iluminação quente, grandiosidade.";
    case BannerStyle.NIKE_ELITE:
      return prefix + "Nike Tech. Alto contraste, preto e branco com destaque na cor do clube, linhas de velocidade.";
    case BannerStyle.ADIDAS_PRO:
      return prefix + "Adidas Performance. Grid técnico ao fundo, três listras sutis, visual moderno.";
    case BannerStyle.NEON_FUTURO:
      return prefix + "Cyberpunk Neon. Fundo escuro com linhas de laser neon vibrantes.";
    case BannerStyle.CINEMATIC_STADIUM:
      return prefix + "Stadium Night. Estádio noturno desfocado (bokeh) ao fundo.";
    case BannerStyle.FIRE_ICE:
      return prefix + "Fire & Ice. Contraste dramático. Esquerda quente (fogo), direita fria (gelo).";
    case BannerStyle.ULTRA_GLOW:
      return prefix + "Ultra Glow. Fundo escuro minimalista com brilho externo forte.";
    default:
      return prefix + "Estilo Esportivo Profissional Premium.";
  }
};

export const generateBanner = async (formData: BannerFormData): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const parts: Part[] = [];
  
  // 1. UPLOADS - STRICT MAPPING
  // Index 0: Main (Center)
  // Index 1: Left (if exists)
  // Index 2: Right (if exists)
  
  parts.push(await fileToPart(formData.athletePhotoMain!)); // Ref A
  
  if (formData.photoCount >= 2 && formData.athletePhotoLeft) {
    parts.push(await fileToPart(formData.athletePhotoLeft)); // Ref B
  }

  if (formData.photoCount === 3 && formData.athletePhotoRight) {
    parts.push(await fileToPart(formData.athletePhotoRight)); // Ref C
  }

  // Logos need to be appended after photos
  if (formData.clubLogo) parts.push(await fileToPart(formData.clubLogo));
  if (formData.schoolLogo) parts.push(await fileToPart(formData.schoolLogo));
  if (formData.clubJersey) parts.push(await fileToPart(formData.clubJersey));

  // 2. LOGIC VARIABLES
  let mainHeadline = "";
  let clubDisplayInstruction = "";
  
  if (formData.status === 'APROVADO') {
      mainHeadline = "APROVADO";
      clubDisplayInstruction = `STATUS: APROVADO. Include Club Name "${formData.clubName || ''}" and logos.`;
  } else if (formData.status === 'CONVOCADO') {
      mainHeadline = "CONVOCADO";
      clubDisplayInstruction = `STATUS: CONVOCADO. DO NOT write club name. Display logos only.`;
  } else if (formData.status === 'CUSTOM') {
      mainHeadline = formData.customStatusText || "";
      clubDisplayInstruction = `STATUS: CUSTOM. DO NOT write club name. Display logos only.`;
  }

  // 3. LAYOUT INSTRUCTION - EXTREME FACE LOCK
  let layoutInstruction = "";

  // Helper text to identify parts based on count
  const img1Ref = "FIRST IMAGE (MAIN)";
  const img2Ref = "SECOND IMAGE (LEFT)";
  const img3Ref = "THIRD IMAGE (RIGHT)";

  if (formData.photoCount === 3) {
      layoutInstruction = `
      ### MULTI-IMAGE PROTOCOL: 3 PHOTOS DETECTED
      
      STEP 1: BACKGROUND
      Generate the background first based on style.
      
      STEP 2: LEFT IMAGE PLACEMENT (CRITICAL FACE LOCK)
      - Take ${img2Ref}.
      - Action: Cut background. Place on the LEFT side.
      - RULE: DO NOT RELIGHT. DO NOT BLEND. PASTE EXACT PIXELS OF THE FACE.
      - Opacity: 100%.
      
      STEP 3: RIGHT IMAGE PLACEMENT (CRITICAL FACE LOCK)
      - Take ${img3Ref}.
      - Action: Cut background. Place on the RIGHT side.
      - RULE: DO NOT RELIGHT. DO NOT BLEND. PASTE EXACT PIXELS OF THE FACE.
      - Opacity: 100%.
      
      STEP 4: CENTER IMAGE PLACEMENT (MAIN)
      - Take ${img1Ref}.
      - Action: Cut background. Place in CENTER, slightly overlapping the side images.
      - This is the HERO image.
      `;
  } else if (formData.photoCount === 2) {
      layoutInstruction = `
      ### MULTI-IMAGE PROTOCOL: 2 PHOTOS DETECTED

      STEP 1: BACKGROUND
      Generate background.

      STEP 2: LEFT IMAGE PLACEMENT (CRITICAL FACE LOCK)
      - Take ${img2Ref}.
      - Action: Cut background. Place on the LEFT side.
      - RULE: DO NOT RELIGHT. DO NOT BLEND. PASTE EXACT PIXELS OF THE FACE.
      
      STEP 3: CENTER IMAGE PLACEMENT (MAIN)
      - Take ${img1Ref}.
      - Action: Cut background. Place to the RIGHT of center.
      - This is the HERO image.
      `;
  } else {
      layoutInstruction = `
      ### SINGLE IMAGE PROTOCOL
      - Take ${img1Ref}.
      - Place in CENTER.
      - Maintain absolute face fidelity.
      `;
  }

  const visualStyle = getStyleDescription(formData.style);

  // 4. FINAL PROMPT
  const prompt = `
  ROLE: DIGITAL COMPOSITOR (NOT PAINTER).
  TASK: Create a sports banner by COMPOSITING uploaded images over a generated background.
  
  INPUTS PROVIDED: ${formData.photoCount} Athlete Photos.
  
  STRICT IDENTITY RULES (ZERO TOLERANCE):
  1. The faces in Input Image 2 and Input Image 3 (if provided) MUST BE IDENTICAL to the original file.
  2. Do not apply "Rim Light" or "Color Grading" to the faces of secondary images. It distorts them.
  3. Treat secondary images as "Stickers" - cut and paste ONLY.
  4. Only the Background should be stylized. The athletes must remain photorealistic.
  
  --- COMPOSITION STEPS ---
  ${layoutInstruction}
  
  --- STYLE ---
  ${visualStyle}
  
  --- TEXT ELEMENTS ---
  HEADLINE: "${mainHeadline}" (Big, Impact/Teko font).
  FOOTER: "Desenvolvido por JDES Sports Academy".
  ${formData.athleteName ? `NAME: "${formData.athleteName}"` : ''}
  ${formData.category ? `CATEGORY: "${formData.category}"` : ''}
  ${formData.customMessage ? `PHRASE: "${formData.customMessage}"` : ''}
  
  ${clubDisplayInstruction}
  
  EXECUTE: Composite these layers now. DO NOT HALLUCINATE NEW FACES.
  `;

  parts.push({ text: prompt });

  const executeGenerationWithRetry = async (retries = 8, delay = 5000): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          systemInstruction: `You are a PHOTO EDITING ENGINE.
          Your goal is to CUT subjects from uploaded photos and PASTE them onto a background.
          
          CRITICAL:
          - When handling multiple photos, process them individually.
          - DO NOT merge the faces.
          - DO NOT redraw the faces.
          - Keep the original resolution and texture of the faces from Image 2 and Image 3.
          `,
          temperature: 0.0, // ABSOLUTE ZERO FOR DETERMINISM
          topP: 0.1,
          topK: 1,
        }
      });
      
      if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
             return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("O modelo não retornou uma imagem válida.");
    } catch (error: any) {
      let errorCode = error.code || error.status;
      let errorMessage = error.message;

      if (!errorCode && error.error) {
        errorCode = error.error.code || error.error.status;
        errorMessage = error.error.message || JSON.stringify(error.error);
      }
      
      if (!errorMessage) errorMessage = JSON.stringify(error);

      const isQuotaError = errorCode === 429 || 
                           errorMessage.includes('429') || 
                           errorMessage.includes('quota') || 
                           errorMessage.includes('RESOURCE_EXHAUSTED');
      
      if (isQuotaError && retries > 0) {
        console.warn(`Quota exceeded (429). Retrying in ${delay/1000}s... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return executeGenerationWithRetry(retries - 1, delay * 2);
      }
      
      throw error;
    }
  };

  try {
    return await executeGenerationWithRetry();
  } catch (error: any) {
    console.error("JDES Engine V6 Error:", error);
    const errorMessage = error.message || JSON.stringify(error);
    if (errorMessage.includes('429') || errorMessage.includes('quota') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("⚠️ Cota de geração excedida. O sistema está sobrecarregado ou seu limite diário foi atingido. Aguarde alguns minutos e tente novamente.");
    }
    throw new Error(error.message || "Falha na geração do banner V6.");
  }
};