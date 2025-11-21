import { useState, useRef } from "react";
import { fetchTokenFromServer } from "@/api/helpers";
import { CommitStrategy, useScribe } from "@elevenlabs/react";

export function useVoiceMode(
  onTranscript: (text: string) => void,
  voiceToken: string,
  setVoiceToken: (text: string) => void
) {
  const [isVoiceMode, setVoiceMode] = useState(false);
  const connectingRef = useRef(false);

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onCommittedTranscript: async (data) => {
      if (data.text !== "") {
        onTranscript(data.text);
      }
    },
  });

  const handleVoiceModeToggle = async () => {
    // Prevent double taps / double toggles
    if (connectingRef.current) return;
    connectingRef.current = true;

    try {
      if (!isVoiceMode) {
        // Activate
        const connection = await scribe.connect({
          token: voiceToken,
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          commitStrategy: CommitStrategy.VAD,
          vadSilenceThresholdSecs: 1,
          minSilenceDurationMs: 100,
          vadThreshold: 0.2,
        });
        setVoiceMode(true);
      } else {
        // Deactivate
        scribe.disconnect();
        setVoiceMode(false);

        // refresh token for next activation
        const newToken = await fetchTokenFromServer();
        setVoiceToken(newToken);
      }
    } finally {
      connectingRef.current = false;
    }
  };

  return {
    isVoiceMode,
    handleVoiceModeToggle,
  };
}
