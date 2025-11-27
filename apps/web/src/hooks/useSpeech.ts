import { useRef, useState } from "react";
import { generateSpeech } from "@/api/helpers";

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(
    null
  );

  const cancelSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setCurrentSpeakingId(null);
    }
  };

  const speak = async (text: string, id: string) => {
    cancelSpeech();
    const blob = await generateSpeech(text);
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audioRef.current = audio;
    setCurrentSpeakingId(id);

    audio.onended = () => {
      URL.revokeObjectURL(url);
      audioRef.current = null;
      setCurrentSpeakingId(null);
    };

    await audio.play();
  };

  return { speak, cancelSpeech, currentSpeakingId, audioRef };
}
