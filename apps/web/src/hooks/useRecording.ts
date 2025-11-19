import { useScribe } from "@elevenlabs/react";

export function useRecording(onTranscribe: (text: string) => void) {
  const scribe = useScribe({
    modelId: "scribe_realtime_v2",
    onPartialTranscript: (data) => {
      // Live transcription as user speaks
      onTranscribe(data.text);
    },
    onCommittedTranscript: (data) => {
      // Final transcription when speech segment completes
      onTranscribe(data.text);
    },
  });

  const handleRecordToggle = async () => {
    if (!scribe.isConnected) {
      try {
        const tokenRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/elevenlabsToken`
        );
        const { token } = await tokenRes.json();

        await scribe.connect({
          token,
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
          },
        });
      } catch (error) {
        console.error("Recording error:", error);
      }
    } else {
      scribe.disconnect();
    }
  };

  return {
    isRecording: scribe.isConnected,
    handleRecordToggle,
  };
}
