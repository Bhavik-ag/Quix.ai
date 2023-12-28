export const getExplanation = async (
  language: string,
  code: string,
  API_KEY: string
) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Given the programming language ${language} and the code snippet: ${code}, provide a concise summary of what the code does in plain English, in no more than 150 words. Include the overall meaning and functionality of the code, rather than describing each line individually. Explain the purpose of the code within the context of the program. Avoid technical jargon and make it easy for a non-technical audience to understand.`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export const getComment = async (
  language: string,
  code: string,
  API_KEY: string
) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Given the programming language ${language} and the following code snippet: ${code} Provide a single-line comment that describes the purpose and functionality of the code in a clear and concise manner. The comment should explain what the code does, any assumptions or constraints, and any potential edge cases that need to be considered.`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

export const answerPrompt = async (
  prompt: string,
  language: string,
  code: string,
  API_KEY: string
) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Given the programming language ${language} and the following code snippet: ${code} I would like you to address the following prompt - ${prompt}.`,
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};
