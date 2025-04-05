// Simple XOR Obfuscation
function xorObfuscate(data, key) {
  return data.split('').map((char, i) => String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))).join('');
}

// Base64 Decode Function
function base64Decode(data) {
  return atob(data);
}

// Simple Decoding Function
function simpleDecode(encodedKey) {
  const decodedKey = base64Decode(encodedKey);  // Base64 decode
  const xorKey = 'simplekey';                   // Simple XOR key for obfuscation
  return xorObfuscate(decodedKey, xorKey);      // Reverse the XOR obfuscation
}

// Example encoded key from Python for decoding
const encodedKey = "AAJAAB4KAUgbAjkkJTQnXj8jMlwpFRQjA1MrIyYXIC1dJzMuEh8rBChXXTIXOgxcQVtWBCNOHDYUQ14HCi8MGCM8Rwk0HxYcMCwZQzsyAwYmFz1eMgAHACMzKT4eQhkOXQcaIlBcCDUmPlEJMT8EHQEdKgIRQAU5MwZUOQQNKQ1fGAEAGCwgRAIIHRVTIhMrBhE5HlRQGQomIz4dGilRX1xIRyg=";
const apiKey = simpleDecode(encodedKey); // Decode your key

async function generateRoast() {
  const userInput = document.getElementById("userInput").value.trim();
  const description = document.getElementById("description").value.trim();
  const intensity = document.getElementById("intensity").value;
  const resultDiv = document.getElementById("roastResult");
  
  if (!userInput || !description) {
    resultDiv.textContent = "Tell me your name and a bit about yourself!";
    return;
  }

  resultDiv.textContent = "Cooking up your roast... 🔥";

  // Use the user's description in the roast prompt
  const prompt = `Roast someone described as: "${userInput}" who says: "${description}". Make it funny and use ${intensity} intensity. Keep it brief.`; 

  try {
    const roast = await fetchRoastFromAPI(prompt, intensity);
    resultDiv.textContent = roast;
  } catch (err) {
    console.error(err);
    resultDiv.textContent = "Uh oh, the roast got too hot to handle.";
  }
}

async function fetchRoastFromAPI(prompt, intensity) {
  const apiEndpoint = "https://api.openai.com/v1/chat/completions";
  const response = await fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",  // You can also use a different model like gpt-3.5-turbo if needed
      messages: [
        {
          role: "system",
          content: "You are a savage roast generator. Keep your roasts short, one-liners only. Do not use em dashes, sound like a human."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 200,  // Limit to keep the response short
    }),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
