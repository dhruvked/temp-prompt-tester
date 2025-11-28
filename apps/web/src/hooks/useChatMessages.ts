import { useState } from "react";
import { getResponse8 } from "@/api/helpers";
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

  const smoothAppend = (
    messageId: string,
    newChunk: string,
    speed = 1 // characters per frame
  ) => {
    let index = 0;

    const step = () => {
      const slice = newChunk.slice(index, index + speed);
      index += speed;

      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId);

        if (idx === -1) return prev;

        const updated = [...prev];
        const oldText = updated[idx].content[0].text;

        updated[idx] = {
          ...updated[idx],
          content: [
            {
              type: "output_text",
              text: oldText + slice,
            },
          ],
        };

        return updated;
      });

      if (index < newChunk.length) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const handleSend = async (input: string) => {
    if (!input.trim() || loading) return;

    const messageId = crypto.randomUUID();

    const userMessage: Message = {
      role: "developer",
      content: [{ type: "input_text", text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    let accumulatedText = "";

    try {
      await getResponse8(
        [...messages, userMessage],
        "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        "435f83e7-6361-4d99-8bdf-12ea1328f0c7",
        messageId,

        (fillerText) => {
          if (!accumulatedText && fillerText) {
            // first chunk, create the message
            setMessages((prev) => [
              ...prev,
              {
                id: messageId,
                role: "assistant",
                content: [{ type: "output_text", text: "" }],
              },
            ]);
          }

          accumulatedText += fillerText;

          smoothAppend(messageId, fillerText);

          if (isVoiceModeRef.current) speak(fillerText, messageId);
        },

        (responseText) => {
          accumulatedText += responseText;

          smoothAppend(messageId, responseText);

          if (isVoiceModeRef.current) speak(responseText, messageId);
        },

        (fullText) => {
          // Final callback when done
          console.log("Response complete:", fullText);
        }
      );
    } catch (err) {
      console.error("SSE error:", err);
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === messageId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            content: [
              {
                type: "output_text",
                text: "Failed to get response, please try again",
              },
            ],
          };
          return updated;
        }
        return prev;
      });
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
