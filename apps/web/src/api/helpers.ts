const getResponse = async (
  messages: any[],
  id: string,
  session_id: string,
  accountId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse7`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: messages,
        id,
        session_id,
        accountId,
      }),
    }
  );

  if (!response.ok) throw new Error("Failed to get response");
  return response.json();
};

export { getResponse };
