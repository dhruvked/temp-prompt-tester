import { useState } from "react";
import { transcribe } from "@/api/helpers";

export function useRecording(onTranscribe: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleRecordToggle = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          const audioFile = new File([audioBlob], "recording.wav", {
            type: "audio/wav",
          });
          try {
            const result = await transcribe(audioFile);
            onTranscribe(result.text);
          } catch (error) {
            console.error("Transcription error:", error);
          }
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      } catch (error) {
        console.error("Microphone error:", error);
      }
    } else {
      mediaRecorder?.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    handleRecordToggle,
  };
}
