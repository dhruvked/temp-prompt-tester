async function getResponse(text: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse2`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    const data = await response.json();
    return data.text;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function setPrompt(text: string) {
  try {
    console.log(text);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/setPrompt`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }
    );
    return;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function getPrompt() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getPrompt`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // cache: "force-cache",
      }
    );
    const data = await response.json();
    return data.prompt;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export { setPrompt, getResponse, getPrompt };
