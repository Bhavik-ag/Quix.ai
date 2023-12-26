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
                text: `Given the programming language ${language} and the following code snippet: ${code} summarize the overall meaning and functionality of the code. In your explanation, try to write in a non-technical manner. Do not describe what each line does in the code, but rather provide a high-level understanding of the overall functionality of the code snippet and the purpose it serves within the context of the program."`,
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
                text: `Given the programming language ${language} and the following code snippet: ${code} Please write a short, one-line comment that clearly explains the high-level purpose of the code. This comment will help new programmers understand the code and make it easier for them to contribute to the project"`,
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
                text: `Given the programming language ${language} and the following code snippet: ${code} Answer the following prompt: ${prompt}. Try to answer the prompt satifying the user's request."`,
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
