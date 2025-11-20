import { useState } from "react";
import { fetchTokenFromServer, transcribe } from "@/api/helpers";
import { CommitStrategy, useScribe } from "@elevenlabs/react";

export function useRecording(
  onTranscribe: (text: string) => void,
  voiceToken: string,
  setVoiceToken: (text: string) => void
) {
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
      const token = voiceToken;
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
      fetchTokenFromServer().then(setVoiceToken);
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
