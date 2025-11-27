import { useState } from "react";
import { fetchTokenFromServer, transcribe } from "@/api/helpers";
import { CommitStrategy, useScribe } from "@elevenlabs/react";
import { connection } from "next/server";

export function useRecording(
  onTranscribe: (text: string) => void,
  voiceToken: string,
  setVoiceToken: (text: string) => void
) {
  const [isRecording, setIsRecording] = useState(false);

  function cleanTranscription(text: string): string {
    return text
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\*[^*]*\*/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      const cleaned = cleanTranscription(data.text);
      onTranscribe(cleaned);
    },
  });

  const handleRecordToggle = async () => {
    if (!isRecording) {
      const token = voiceToken;
      const connection = await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      setIsRecording(true);
    } else {
      fetchTokenFromServer().then(setVoiceToken);
      scribe.disconnect();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    handleRecordToggle,
  };
}
