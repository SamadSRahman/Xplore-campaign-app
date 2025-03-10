import axios from 'axios';
import { useState } from 'react';

export default function useChatBot() {

    let API_BASE_URL = 'https://pre.xplore.xircular.io/api'; 
    if(window.location.origin==="https://xplr.live"||window.location.origin.includes("localhost")||window.location.origin.includes("vercel")){
        console.log(window.location.origin);  
     API_BASE_URL = 'https://xplr.live/api';
    }
    const campaignId = localStorage.getItem("longId")

    const [generatedText, setGeneratedText] = useState("");

  
    const parseApiResponse = (responseText) => {
      // Use the helper to unescape the response text.
      const unescapedResponse = unescapeString(responseText);
      console.log("Unescaped Response:", unescapedResponse);
    
      // First, try to parse the unescaped response as JSON.
      try {
        const parsedJson = JSON.parse(unescapedResponse);
        return parsedJson;
      } catch (e) {
        console.log("Unescaped response is not valid JSON. Proceeding with regex extraction.");
      }
    
      // If JSON parsing fails, use regex extraction.
    
      // Extract Answer – updated regex to optionally match a key like "answer" or "answer updated"
      let answerMatch = unescapedResponse.match(/"answer(?:\s*updated)?":\s*"([^"]+)"/);
      let answer = answerMatch ? answerMatch[1].trim() : '';
    
      // Extract Questions – assuming questions is a JSON array
      let questions = [];
      let questionsMatch = unescapedResponse.match(/"questions":\s*(\[[^\]]*\])/);
      if (questionsMatch) {
        try {
          questions = JSON.parse(questionsMatch[1]);
        } catch (err) {
          // If JSON parsing fails, split by comma as a fallback
          questions = questionsMatch[1].replace(/[\[\]]/g, '').split(/,\s*/);
        }
      }
    
      // Extract Summary
      let summaryMatch = unescapedResponse.match(/"summary":\s*"([^"]+)"/);
      let summary = summaryMatch ? summaryMatch[1].trim() : '';
    
      console.log("✅ Extracted Answer:", answer);
      console.log("✅ Extracted Questions:", questions);
      console.log("✅ Extracted Summary:", summary);
    
      return { answer, questions, summary };
    };
const unescapeString = (str) => {
  try {
    // Wrap in quotes and parse so that escaped characters (like \n, \") are converted
    return JSON.parse('"' + str.replace(/"/g, '\\"') + '"');
  } catch (e) {
    console.error("Unescape failed:", e);
    return str;
  }
};

    
    const getEncodedKey = async () => {
      const response = await axios.get(`${API_BASE_URL}/v1/auth/key`);
      console.log(response.data)
      return response.data.key;
    }
    const postMessage = async (query, onChunk) => {
      try {
        const key = await getEncodedKey();
        const response = await fetch(`${API_BASE_URL}/v1/chatBot/chat?campaignId=${campaignId}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-encrypted-auth': key,
          },
          body: JSON.stringify({ Question: query }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let finalText = "";
        let isGreetingResponse = false;
        let fullResponse = "";
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          const chunk = decoder.decode(value, { stream: true });
          console.log("Received chunk:", chunk);
    
          // Remove "data:" prefix if present and trim the chunk
          let trimmedChunk = chunk.trim();
          if (trimmedChunk.startsWith("data:")) {
            trimmedChunk = trimmedChunk.substring("data:".length).trim();
          }
    
          // Check if this chunk looks like a complete greeting JSON response
          if (
            trimmedChunk.includes('"answer"') &&
            trimmedChunk.includes('"questions"') &&
            trimmedChunk.includes('"summary"')
          ) {
            isGreetingResponse = true;
            fullResponse = trimmedChunk;
            break;
          }
    
          try {
            const parsedChunk = JSON.parse(trimmedChunk);
            if (parsedChunk && parsedChunk.content) {
              // 1) Clean out the escape sequences
              const cleanedContent = parsedChunk.content
                .replace(/\\n/g, ' ')
                .replace(/\\/g, '');
          
              // 2) Accumulate only cleaned text
              finalText += cleanedContent;
          
              // 3) Pass cleaned chunk to your UI
              if (onChunk) onChunk(cleanedContent);
            }
          } catch (e) {
            // Fallback: if parsing fails, also do a minimal clean
            const regex = /"content":"(.*?)"/g;
            let match;
            while ((match = regex.exec(trimmedChunk)) !== null) {
              const cleanedContent = match[1]
                .replace(/\\n/g, ' ')
                .replace(/\\/g, '');
          
              finalText += cleanedContent;
              if (onChunk) onChunk(cleanedContent);
            }
          }
        }
    
        if (isGreetingResponse) {
          try {
            // Try to extract a valid JSON from the full greeting response
            const jsonMatches = fullResponse.match(/\{.*?\}/gs);
            let jsonString = "";
            for (let json of jsonMatches) {
              try {
                const parsedJSON = JSON.parse(json);
                if (parsedJSON.answer && parsedJSON.questions && parsedJSON.summary) {
                  jsonString = json;
                  break;
                }
              } catch (e) {
                continue;
              }
            }
            if (!jsonString) throw new Error("No valid JSON found.");
            console.log("Extracted Greeting JSON:", jsonString);
            const jsonResponse = JSON.parse(jsonString);
            return jsonResponse;
          } catch (error) {
            console.error("Error parsing greeting response JSON:", error);
            return {
              answer: "Error retrieving response.",
              questions: [],
              summary: "No information available.",
            };
          }
        }
    
        console.log("Accumulated response:", finalText);
        return parseApiResponse(finalText);
      } catch (error) {
        console.error("Error while calling chatbot API", error);
        throw error;
      }
    };
    
    
    const getSpeechFromText = async (text) => {
      try {
        const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
          method: "POST",
          headers: {
            "xi-api-key": "sk_54bb120d056452299fd2f6aa61cb6cdd5a115d8e16a02485",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const audioBlob = await response.blob();

        return audioBlob
      } catch (error) {
        console.error("error getting speech from text",error);
      }
      
    }

  return {postMessage, generatedText, getSpeechFromText}
}

