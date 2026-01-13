import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBtO01_5a-ZIt-61dO9VClEg-oDW-0FqJY";

const genAI = new GoogleGenerativeAI(API_KEY);

// Text generation model
export const textModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Image generation model (using Imagen via Gemini)
export const imageModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate text response
export async function generateText(prompt, history = []) {
  try {
    const chat = textModel.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return {
      success: true,
      text: response.text(),
      type: "text",
    };
  } catch (error) {
    console.error("Error generating text:", error);
    return {
      success: false,
      error: error.message,
      type: "text",
    };
  }
}

// Generate text with streaming
export async function generateTextStream(prompt, history = [], onChunk) {
  try {
    const chat = textModel.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessageStream(prompt);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) {
        onChunk(chunkText, fullText);
      }
    }

    return {
      success: true,
      text: fullText,
      type: "text",
    };
  } catch (error) {
    console.error("Error generating text stream:", error);
    return {
      success: false,
      error: error.message,
      type: "text",
    };
  }
}

// Analyze image with text
export async function analyzeImage(imageData, prompt, mimeType = "image/jpeg") {
  try {
    const result = await textModel.generateContent([
      {
        inlineData: {
          data: imageData,
          mimeType: mimeType,
        },
      },
      prompt || "What's in this image? Describe it in detail.",
    ]);

    const response = await result.response;
    return {
      success: true,
      text: response.text(),
      type: "text",
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    return {
      success: false,
      error: error.message,
      type: "text",
    };
  }
}

// Generate image (using Imagen 3 via Gemini API)
export async function generateImage(prompt) {
  try {
    // Using the newer Imagen model for image generation
    const imagenModel = genAI.getGenerativeModel({ 
      model: "imagen-3.0-generate-002",
    });

    const result = await imagenModel.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseModalities: ["image", "text"],
        responseMimeType: "image/png",
      }
    });

    const response = await result.response;
    
    // Check if we got an image in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return {
          success: true,
          imageData: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
          type: "image",
        };
      }
    }

    return {
      success: false,
      error: "No image generated",
      type: "image",
    };
  } catch (error) {
    console.error("Error generating image:", error);
    // If Imagen is not available, return a helpful message
    if (error.message.includes("not found") || error.message.includes("not supported")) {
      return {
        success: false,
        error: "Image generation requires the Imagen API which may not be available in your region or API tier. Please try a text prompt instead.",
        type: "image",
      };
    }
    return {
      success: false,
      error: error.message,
      type: "image",
    };
  }
}

// Check if prompt is for image generation
export function isImageGenerationPrompt(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const imageKeywords = [
    "generate image",
    "create image",
    "draw",
    "make a picture",
    "create a picture",
    "generate a picture",
    "make an image",
    "create an illustration",
    "generate an illustration",
    "design",
    "visualize",
    "render",
    "paint",
    "sketch",
    "generate art",
    "create art",
    "make art",
  ];

  return imageKeywords.some((keyword) => lowerPrompt.includes(keyword));
}

export default {
  generateText,
  generateTextStream,
  analyzeImage,
  generateImage,
  isImageGenerationPrompt,
};
