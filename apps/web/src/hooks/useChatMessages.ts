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

    // ✅ Generate one UUID for this message cycle
    const messageId = crypto.randomUUID();

    const userMessage: Message = {
      role: "developer",
      content: [{ type: "input_text", text: input }],
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    // temp filler storage
    let fillerTextStore = "";

    try {
      await getResponse8(
        [...messages, userMessage],
        /* avatar id */ "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        /* account */ "435f83e7-6361-4d99-8bdf-12ea1328f0c7",
        messageId, // ✅ send SAME messageId to backend

        // --- FILLER CALLBACK ---
        (fillerText) => {
          fillerTextStore = fillerText;

          const fillerMsg: Message = {
            id: messageId, // ✅ SAME ID
            role: "assistant",
            content: [{ type: "output_text", text: fillerText }],
          };

          setMessages((prev) => [...prev, fillerMsg]);

          if (isVoiceModeRef.current) {
            speak(fillerText, messageId);
          }
        },

        // --- FINAL RESPONSE CALLBACK ---
        (finalText) => {
          setMessages((prev) => {
            // remove filler (same ID)
            const withoutFiller = prev.filter((m) => m.id !== messageId);

            const finalMsg: Message = {
              id: messageId, // ✅ SAME ID persists
              role: "assistant",
              content: [
                {
                  type: "output_text",
                  text: fillerTextStore + "..." + finalText,
                },
              ],
            };

            return [...withoutFiller, finalMsg];
          });
          if (isVoiceModeRef.current) {
            speak(finalText, messageId);
          }
        }
      );
    } catch (err) {
      console.error("SSE error:", err);

      // cleanup filler on failure
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
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
