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

const storeFeedback = async (
  messageId: string,
  feedback: {
    accuracy?: number;
    comments?: string;
    idealAnswer?: string;
    isUseful?: boolean | null;
  }
) => {
  const filteredFeedback = Object.fromEntries(
    Object.entries(feedback).filter(([_, v]) => v !== undefined && v !== "")
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
export { getResponse, storeFeedback };
