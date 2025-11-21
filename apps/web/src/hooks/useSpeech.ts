import { useRef, useState } from "react";
import { generateSpeech } from "@/api/helpers";

export function useSpeech() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cancelSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setIsSpeaking(false);
    }
  };

  const speak = async (text: string) => {
    try {
      // stop previous audio
      cancelSpeech();

      const blob = await generateSpeech(text);
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsSpeaking(true);

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        setIsSpeaking(false);
      };

      await audio.play();
    } catch (err) {
      console.error("speech error", err);
      cancelSpeech();
    }
  };

  return { speak, cancelSpeech, isSpeaking, audioRef };
}
