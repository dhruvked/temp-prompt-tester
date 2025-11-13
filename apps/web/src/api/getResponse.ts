async function getResponse2(text: string) {
  const responses = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse2`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
  const output_text = await responses.text();
  return output_text;
}

async function getQuickResponse(text: string) {
  const responses = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse5`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    }
  );
  const data = await responses.json();
  return data.response;
}

async function validateResponse(quickResponse: string, mainResponse: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/validateResponse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quickResponse, mainResponse }),
    }
  );
  const data = await response.json();
  return data.response;
}

async function* getResponse(text: string, signal?: AbortSignal) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal,
    }
  );

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      yield chunk;
    }
  } finally {
    reader.cancel();
  }
}

async function testResponse(format: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/testResponse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format }),
    }
  );
  const data = await response.json();
  return data;
}

export {
  getResponse,
  getResponse2,
  validateResponse,
  getQuickResponse,
  testResponse,
};
