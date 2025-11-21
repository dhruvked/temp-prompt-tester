import { useState } from "react";
import { fetchTokenFromServer, transcribe } from "@/api/helpers";
import { CommitStrategy, useScribe } from "@elevenlabs/react";

export function useVoiceMode(
  onSend: (text: string) => void,
  voiceToken: string,
  setVoiceToken: (text: string) => void
) {
  const [isVoiceMode, setVoiceMode] = useState(false);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onCommittedTranscript: (data) => {
      console.log("committed", data.text);
      onSend(data.text);
    },
    onPartialTranscript: (data) => {
      console.log("partial", data.text);
    },
  });

  const handleVoiceModeToggle = async () => {
    if (!isVoiceMode) {
      console.log(voiceToken);
      const token = voiceToken;
      const connection = await scribe.connect({
        token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        commitStrategy: CommitStrategy.VAD,
        vadSilenceThresholdSecs: 1.5,
      });
      console.log(connection);
      setVoiceMode(true);
    } else {
      fetchTokenFromServer().then(setVoiceToken);
      scribe.disconnect();
      setVoiceMode(false);
    }
  };

  return {
    isVoiceMode,
    handleVoiceModeToggle,
  };
}
