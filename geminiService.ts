
import { GoogleGenAI } from "@google/genai";

// Vérification sécurisée pour l'environnement client
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateVenueHype = async (venueName: string, city: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a dark, aggressive, and high-energy nightclub "hype" announcement for a hard music event at ${venueName} in ${city}. Focus on the DJs Alixx and DJ Revaxx under the Revalixx label. Keep it short (2 sentences max).`,
      config: {
        temperature: 0.9,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating hype:", error);
    return "Prepare for total sonic annihilation. Revalixx is coming.";
  }
};
