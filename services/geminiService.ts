
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function validateAndExtractImageFeatures(base64Image: string, category: string, language: string = 'en') {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: `Analyze this image for a Carbon MRV system. Category: ${category}.
        Language for response: ${language}.
        Return JSON with keys: 
        'isValid' (boolean), 
        'reason' (string, a short user-friendly reason in ${language} explaining why it failed if invalid), 
        'suggestion' (string, a helpful suggestion in ${language} on how to retake the photo for better results),
        'blurScore' (0-1), 
        'brightness' (0-1), 
        'extractedFeatures' (object).` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          reason: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          blurScore: { type: Type.NUMBER },
          brightness: { type: Type.NUMBER },
          extractedFeatures: { 
            type: Type.OBJECT,
            properties: {
              soilColor: { type: Type.STRING },
              canopyDensity: { type: Type.NUMBER },
              treeCount: { type: Type.INTEGER }
            }
          }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { isValid: false, reason: "Analysis failed", suggestion: "Please try again." };
  }
}

/**
 * Bhashini AI Mock: Processes audio input from farmer to extract form data.
 */
export async function processVoiceForm(base64Audio: string, fieldHint: string, language: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Audio, mimeType: 'audio/webm' } },
        { text: `You are a Bhashini-powered AI for Indian farmers. The farmer is speaking in an Indian language or English. 
        Focus on extracting information for the field: "${fieldHint}".
        Return JSON with a single key "value" containing the extracted data (string or number as appropriate). 
        If the farmer provides a full sentence like "Mera naam Ramesh hai", extract just "Ramesh".
        If they specify a number like "do acre", extract "2".` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          value: { type: Type.STRING }
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Voice processing failed", e);
    return { value: null };
  }
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function getVoiceGuidance(text: string, language: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say in ${language}: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
        }
      }
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.warn("TTS failed", error);
    return null;
  }
}

export async function detectAnomalies(mrvData: any) {
  const prompt = `Analyze this MRV data for anomalies or fraud:
  Boundary: ${JSON.stringify(mrvData.boundary)}
  Images: ${JSON.stringify(mrvStateToSlim(mrvData))}
  Metadata: ${JSON.stringify(mrvData.metadata)}
  
  Check if locations match boundaries. Return JSON with 'anomalies' (array) and 'riskScore' (0-1).`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          anomalies: { type: Type.ARRAY, items: { type: Type.STRING } },
          riskScore: { type: Type.NUMBER }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
}

function mrvStateToSlim(state: any) {
  return state.images.map((i: any) => ({ cat: i.category, loc: i.location }));
}
