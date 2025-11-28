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
  const [mute, setMute] = useState(false);
  const muteRef = useRef(false);

  // Keep ref in sync with state
  muteRef.current = mute;

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onCommittedTranscript: async (data) => {
      if (data.text.length < 3) return;
      if (muteRef.current) return;
      if (data.text !== "") {
        onTranscript(data.text);
      }
    },
    onPartialTranscript: async (data) => {
      if (muteRef.current) return;
      if (data.text !== "") {
      }
    },
  });

  const handleVoiceModeToggle = async () => {
    try {
      // Create and play a silent audio context
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      if (audioContext.state === "suspended") {
        await audioContext.resume();
      }

      // Play a brief silent sound to unlock
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      gain.gain.setValueAtTime(0, audioContext.currentTime); // silent
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (err) {
      console.error("Audio unlock failed:", err);
    }
    // Prevent double taps / double toggles
    if (connectingRef.current) return;
    connectingRef.current = true;

    try {
      if (!isVoiceMode) {
        // Activate
        const connection = await scribe.connect({
          token: voiceToken,
          languageCode: "en",
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          commitStrategy: CommitStrategy.VAD,
          vadSilenceThresholdSecs: 1,
          minSilenceDurationMs: 100,
          vadThreshold: 0.4,
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

  const toggleMute = () => setMute((m) => !m);

  return {
    isVoiceMode,
    handleVoiceModeToggle,
    mute,
    toggleMute,
  };
}
