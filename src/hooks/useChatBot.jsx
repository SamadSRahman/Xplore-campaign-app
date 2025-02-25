// import axios from 'axios';
// import { useState } from 'react';

// export default function useChatBot() {

//     let API_BASE_URL = 'https://pre.xplore.xircular.io/api'; 
//     if(window.location.origin==="https://xplr.live"||window.location.origin.includes("localhost")||window.location.origin.includes("vercel")){
//         console.log(window.location.origin);  
//      API_BASE_URL = 'https://xplr.live/api';
//     }

//     const [generatedText, setGeneratedText] = useState("")
//     const postMessage = async (query) => {
//       try {
//         const response = await fetch(
//             `${API_BASE_URL}/v1/chatBot/chat`,
//             {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ Question: query }),
//             }
//         );

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const reader = response.body.getReader();
//         const decoder = new TextDecoder('utf-8');
//         let accumulatedText = "";

//         while (true) {
//             const { done, value } = await reader.read();

//             if (done) {
//                 console.log("Stream finished");
//                 break;
//             }

//             const chunk = decoder.decode(value, { stream: true });
//             accumulatedText += chunk;

//             // Update the UI with the current accumulated text
//             setGeneratedText((prevText) => prevText + chunk);
//         }

//         console.log("Final response:", accumulatedText);
//         return accumulatedText;
//     } catch (error) {
//         console.error("Error while calling chatbot streaming API", error);
//         throw error;
//     }
//     }

//     const getSpeechFromText = async (text) => {
//       try {
//         const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
//           method: "POST",
//           headers: {
//             "xi-api-key": "sk_54bb120d056452299fd2f6aa61cb6cdd5a115d8e16a02485",
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             text: text
//           }),
//         });
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const audioBlob = await response.blob();

//         return audioBlob
//       } catch (error) {
//         console.error("error getting speech from text",error);
//       }
      
//     }
//   return {postMessage, generatedText, getSpeechFromText}
// }

import axios from 'axios';
import { useState } from 'react';

export default function useChatBot() {

    let API_BASE_URL = 'https://pre.xplore.xircular.io/api'; 
    if(window.location.origin==="https://xplr.live"||window.location.origin.includes("localhost")||window.location.origin.includes("vercel")){
        console.log(window.location.origin);  
     API_BASE_URL = 'https://xplr.live/api';
    }

    const [generatedText, setGeneratedText] = useState("");

    const parseApiResponse = (responseText) => {
      // ✅ Clean unnecessary escape characters
      let cleanedResponse = responseText.replace(/\\n/g, ' ').replace(/\\/g, '').replace(/\}/g, '').trim();
    
      // ✅ Extract Answer
      let answerMatch = cleanedResponse.match(/answer\s*([\s\S]*?)\s*questions/);
      let answer = answerMatch ? answerMatch[1].trim() : '';
    
      // ✅ Extract Questions with fixed regex
      let questionsMatch = cleanedResponse.match(/questions\s*\[\s*([\s\S]*?)\s*(?:\]|\n\s*\\summary|\\summary)/);
      let questions = [];
      if (questionsMatch) {
          questions = questionsMatch[1]
              .split(/\\?\?\s*/)  
              .map(q => q.trim().replace(/^\\/, '').replace(/\\$/, ''))  
              .filter(q => q.length > 0)  
              .map(q => q.endsWith('?') ? q : q + '?'); 
      }
    
      // ✅ Extract Summary
      let summaryMatch = cleanedResponse.match(/summary\s*([\s\S]*)/);
      let summary = summaryMatch ? summaryMatch[1].trim() : '';
    
      console.log("✅ Extracted Answer:", answer);
      console.log("✅ Extracted Questions:", questions);
      console.log("✅ Extracted Summary:", summary);
    
        return {
            answer: answer,
            questions: questions,
            summary: summary
         };
    };
    

    // const postMessage = async (query) => {
    //   try {
    //     const response = await fetch(`${API_BASE_URL}/v1/chatBot/chat`, {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ Question: query }),
    //     });
    
    //     if (!response.ok) {
    //       throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const reader = response.body.getReader();
    //     const decoder = new TextDecoder("utf-8");
    //     let finalText = "";
    //     let fullResponse = ""; // Store full JSON response for greetings
    //     let isGreetingResponse = false;
    
    //     while (true) {
    //       const { done, value } = await reader.read();
    //       if (done) break;
    
    //       const chunk = decoder.decode(value, { stream: true });
    //       console.log("Received chunk:", chunk);

    //       // Handle greeting responses (full JSON object)
    //       if (chunk.includes('"answer"') && chunk.includes('"questions"') && chunk.includes('"summary"')) {
    //             isGreetingResponse = true;
    //             fullResponse = chunk;
    //             break; // Stop reading since it's not a stream
    //       }

    //       const regex = /"content":"(.*?)"/g;
    //       let match;
    //       while ((match = regex.exec(chunk)) !== null) {
    //         let content = match[1]; 
    //         finalText += content;
    //       }
    //     }

    // // ✅ If it's a greeting response, extract and parse JSON safely
    // if (isGreetingResponse) {
    //   try {
    //     // 🔹 Extract valid JSON by removing `data: ` prefixes and selecting the correct JSON
    //     const jsonMatches = fullResponse.match(/\{.*?\}/gs); // Extracts all JSON objects
    //     let jsonString = "";

    //     for (let json of jsonMatches) {
    //       try {
    //         const parsedJSON = JSON.parse(json);
    //         if (parsedJSON.answer && parsedJSON.questions && parsedJSON.summary) {
    //           jsonString = json;
    //           break; // Stop once we find the valid JSON
    //         }
    //       } catch (e) {
    //         continue; // Ignore invalid JSON parts
    //       }
    //     }

    //     if (!jsonString) throw new Error("No valid JSON found.");

    //     console.log("✅ Extracted Greeting JSON:", jsonString);

    //     const jsonResponse = JSON.parse(jsonString); // Parse valid JSON

    //     return {
    //       answer: jsonResponse.answer,
    //       questions: jsonResponse.questions,
    //       summary: jsonResponse.summary,
    //     };
    //   } catch (error) {
    //     console.error("Error parsing greeting response JSON:", error);
    //     return { answer: "Error retrieving response.", questions: [], summary: "No information available." };
    //   }
    // }
    
    //     console.log("✅ Final response:", finalText);  
    //     return parseApiResponse(finalText);
    
    //   } catch (error) {
    //     console.error("Error while calling chatbot API", error);
    //     return { answer: "Error retrieving response.", questions: [], summary: "No information available." };
    //   }
    // };


    const postMessage = async (query, onChunk) => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/chatBot/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
    
          // Check if this is a full greeting JSON response
          if (
            chunk.includes('"answer"') &&
            chunk.includes('"questions"') &&
            chunk.includes('"summary"')
          ) {
            isGreetingResponse = true;
            fullResponse = chunk;
            break;
          }
    
          // Extract content from the chunk using regex
          const regex = /"content":"(.*?)"/g;
          let match;
          while ((match = regex.exec(chunk)) !== null) {
            let content = match[1];
            finalText += content;
            // Call the onChunk callback with the new piece of text
            if (onChunk) onChunk(content);
          }
        }
    
        if (isGreetingResponse) {
          try {
            // Extract valid JSON from the full greeting response
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
    
        console.log("Final response:", finalText);
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

