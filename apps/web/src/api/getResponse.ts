async function getResponse(text: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse7`,
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

export {  getResponse };
