import { useState } from "react";
import { getResponse } from "@/api/helpers";

type Message = {
  id?: string;
  role: "developer" | "assistant";
  content: [{ type: "input_text" | "output_text"; text: string }];
};

export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [session_id] = useState(() => crypto.randomUUID());

  const handleSend = async (input: string) => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "developer",
      content: [{ type: "input_text", text: input }],
    };

    let updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setLoading(true);

    try {
      const response = await getResponse(
        updatedMessages,
        "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        "435f83e7-6361-4d99-8bdf-12ea1328f0c7"
      );

      const assistantMessage: Message = {
        id: response.messageId,
        role: "assistant",
        content: [{ type: "output_text", text: response.text }],
      };

      updatedMessages = [...updatedMessages, assistantMessage];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    session_id,
    handleSend,
  };
}
