const getResponse = async (
  messages: any[],
  id: string,
  session_id: string,
  accountId: string
) => {
  const cleanedMessages = messages.map(({ id, ...rest }) => rest);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse7`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: cleanedMessages,
        id,
        session_id,
        accountId,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to get response");
  return response.json();
};

const getResponse8 = async (
  messages: any[],
  id: string,
  session_id: string,
  accountId: string,
  messageId: string,
  onFiller: (text: string) => void,
  onResponse: (text: string) => void
) => {
  const cleanedMessages = messages.map(({ id, ...rest }) => rest);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse8`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: cleanedMessages,
        id,
        session_id,
        accountId,
        messageId,
      }),
    }
  );
  if (!response.ok) throw new Error("Failed to get response");
  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = JSON.parse(line.slice(6));

        if (data.type === "filler") {
          onFiller(data.text);
        } else if (data.type === "response") {
          onResponse(data.text);
        } else if (data.type === "done") {
          return;
        }
      }
    }
  }
};

const quickResponse = async (text: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/quickResponse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  if (!response.ok) throw new Error("Failed to get quick response");
  return response.json();
};

const getResponse9 = async (
  messages: any[],
  id: string,
  session_id: string,
  accountId: string
) => {
  const cleanedMessages = messages.map(({ id, ...rest }) => rest);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse9`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: cleanedMessages,
        id,
        session_id,
        accountId,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to get response");
  return response.json();
};

const storeFeedback = async (
  messageId: string,
  feedback: {
    correctness?: number;
    relevance?: number;
    tone?: number;
    comments?: string;
    idealAnswer?: string;
    isUseful?: boolean | null;
  }
) => {
  const filteredFeedback = Object.fromEntries(
    Object.entries(feedback).filter(([_, v]) => v !== undefined)
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/storeFeedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId,
        feedback: filteredFeedback,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to store feedback");
  return response.json();
};

export const generateSpeech = async (text: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/textToSpeech`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );

  if (!res.ok) throw new Error("TTS failed");

  return await res.blob();
};

const transcribe = async (audioFile: File) => {
  const formData = new FormData();
  formData.append("model_id", "scribe_v1");
  formData.append("file", audioFile);
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: new Headers({
      "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLAB_API_KEY as string,
    }),
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error("Failed to store feedback");

  return data;
};

async function fetchTokenFromServer() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/elevenlabsToken`
  );
  const data = await res.json();
  return data.token;
}
export {
  getResponse,
  storeFeedback,
  transcribe,
  getResponse8,
  fetchTokenFromServer,
  quickResponse,
  getResponse9,
};
