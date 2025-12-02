"use client";
import handleSpeak from "@/api/handleSpeak";
import transcribe from "@/api/transcribe";
import { Button } from "@mantine/core";
import { useState } from "react";

export default function useVoiceInput({
  avatar,
  setStatus,
  setCaption,
  abortRef,
  speakQueue,
  mediaUrl,
  mediaIndex,
}: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const startRecording = async () => {
    try {
      setStatus("listening to voice");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] | undefined = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      //stop handler
      recorder.onstop = async () => {
        setStatus("thinking");
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
          type: "audio/wav",
        });
        const response = await transcribe(audioFile);
        setCaption(response.text);
        await handleSpeak(
          avatar,
          response.text,
          speakQueue,
          setStatus,
          mediaUrl,
          mediaIndex
        );
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  return { startRecording, stopRecording, isRecording };
}
