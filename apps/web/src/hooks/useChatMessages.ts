import { useState } from "react";
import {
  getResponse,
  getResponse8,
  quickResponse,
  getResponse9,
} from "@/api/helpers";
type Message = {
  id?: string;
  role: "developer" | "assistant";
  content: [{ type: "input_text" | "output_text"; text: string }];
};

export function useChatMessages(
  session_id: string,
  speak: (message: string, id: string) => void,
  isVoiceModeRef: React.RefObject<boolean>
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (input: string) => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "developer",
      content: [{ type: "input_text", text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Step 1: Get quick response (filler)
      const quickResp = await quickResponse(input);
      const fillerText = quickResp.text;

      // Add filler message
      const fillerMessage: Message = {
        id: "filler-temp",
        role: "assistant",
        content: [{ type: "output_text", text: fillerText }],
      };
      setMessages((prev) => [...prev, fillerMessage]);

      if (isVoiceModeRef.current) {
        speak(fillerText, fillerMessage.id!);
      }
      // Step 2: Get main response
      const response = await getResponse9(
        [...messages, userMessage],
        "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        "435f83e7-6361-4d99-8bdf-12ea1328f0c7"
      );

      // Replace filler with real response
      setMessages((prev) => {
        const withoutFiller = prev.filter((m) => m.id !== "filler-temp");
        const assistantMessage: Message = {
          id: response.messageId,
          role: "assistant",
          content: [
            {
              type: "output_text",
              text: fillerMessage.content[0].text + "..." + response.text,
            },
          ],
        };
        return [...withoutFiller, assistantMessage];
      });

      if (isVoiceModeRef.current) {
        speak(response.text, response.messageId!);
      }
    } catch (error) {
      console.error("Error:", error);
      // Remove filler on error
      setMessages((prev) => prev.filter((m) => m.id !== "filler-temp"));
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
