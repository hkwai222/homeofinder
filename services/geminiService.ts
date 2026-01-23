
import { GoogleGenAI } from "@google/genai";
import { UserData, AppMode } from "../types";

/**
 * 啟動智能流式分析 - 使用 generateContentStream
 */
export const startAnalysisStream = async (mode: AppMode, data: UserData, photoBase64?: string) => {
  // Accessing the key inside the function to ensure we get the latest injected value.
  // We check for both null/empty and the string "undefined" which can occur in some environments.
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    throw new Error("API_KEY_NOT_FOUND");
  }

  // Always create a fresh instance right before the call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey });
  
  // Use 'gemini-3-pro-preview' for high-quality reasoning tasks.
  const modelName = 'gemini-3-pro-preview';

  const systemInstruction = `
    你是一位專業的順勢療法 (Homeopathy) 專家及臨床分析師。
    你的任務是根據使用者提供的多維度資訊，進行深度體質或急性病症分析。
    
    【語言規則 - 極重要】
    1. 請偵測使用者在輸入內容時所使用的主要語言。
    2. 無論系統介面語系為何，請務必使用該「使用者輸入的語言」來撰寫整份分析報告。
    3. 如果輸入包含多種語言，請以其最主要表達的語言回覆。
    
    【分析指南】
    1. 針對「體質分析」，需綜合心理、情緒、飲食與主訴，尋找關鍵的療劑圖景 (Remedy Picture)。
    2. 針對「急救分析」，需快速識別病症特點與誘因。
    3. 必須包含 SRP (Strange, Rare and Peculiar) 症狀的考量。
    
    輸出格式 (請使用 Markdown)：
    # [分析標題]
    ## 1. 症狀與病情評估
    ## 2. 順勢療法臨床分析
    ## 3. 推薦療劑建議
    ## 4. 專業叮嚀
  `;

  const promptText = `
    分析模式：${mode === AppMode.CONSTITUTION ? '個人體質搜尋' : '急救小幫手'}
    使用者臨床資料：${JSON.stringify(data)}
  `;

  // Standardize contents as an array of Content objects.
  const contents: any[] = [{
    role: 'user',
    parts: [{ text: promptText }]
  }];

  if (photoBase64 && photoBase64.includes(',')) {
    const base64Data = photoBase64.split(',')[1];
    const mimeType = photoBase64.split(';')[0].split(':')[1];
    contents[0].parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType
      }
    });
  }

  try {
    return await ai.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        systemInstruction: systemInstruction,
        // When setting thinkingBudget, maxOutputTokens must be larger than the budget to leave room for the final answer.
        maxOutputTokens: 20000, 
        thinkingConfig: { thinkingBudget: 10000 },
        temperature: 1,
      },
    });
  } catch (err: any) {
    console.error("Gemini Stream Error:", err);
    throw err;
  }
};
