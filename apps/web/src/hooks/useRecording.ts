import { useState } from "react";
import { transcribe } from "@/api/helpers";
import { CommitStrategy, useScribe } from "@elevenlabs/react";

export function useRecording(onTranscribe: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  function cleanTranscription(text: string): string {
    return text
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\*[^*]*\*/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  async function fetchTokenFromServer() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/elevenlabsToken`
    );
    const data = await res.json();
    return data.token;
  }

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      const cleaned = cleanTranscription(data.text);
      onTranscribe(cleaned);
    },
    onCommittedTranscript: (data) => {
      const cleaned = cleanTranscription(data.text);
      onTranscribe(cleaned);
    },
  });

  const handleRecordToggle = async () => {
    if (!isRecording) {
      const token = await fetchTokenFromServer();

      console.log(token);
      const connection = await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      setIsRecording(true);
    } else {
      scribe.commit;
      scribe.disconnect();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    handleRecordToggle,
  };
}
