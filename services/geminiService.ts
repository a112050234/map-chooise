
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getTravelSummary = async (attractionName: string, intro: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a local Taipei travel expert. Provide a concise (under 100 words), engaging travel tip and summary for the following attraction: "${attractionName}". Here is the official intro: ${intro}. Focus on what makes it unique and a "must-do" activity there. Answer in Traditional Chinese.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return null;
  }
};

export const chatWithAssistant = async (
  query: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  userLocation?: { lat: number, lng: number }
) => {
  try {
    const model = 'gemini-2.5-flash-lite-latest';
    const config: any = {
      tools: [{ googleSearch: {} }],
      systemInstruction: "你是一位熱愛台北的旅遊專家。你可以回答關於台北景點、交通、美食、天氣或活動的問題。如果需要，請利用搜尋功能提供最新的資訊。回答請使用繁體中文，語氣活潑親切。",
    };

    if (userLocation) {
      config.tools.push({ googleMaps: {} });
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const chat = ai.chats.create({
      model,
      config,
      history,
    });

    const response = await chat.sendMessage({ message: query });
    
    // Extract grounding URLs if any
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        return null;
      })
      .filter(Boolean);

    return {
      text: response.text,
      urls: urls as { title: string; uri: string }[]
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};
