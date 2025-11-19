import { useState, useRef } from "react";

export function useRecording(
  onTranscribe: (text: string, isFinal: boolean) => void
) {
  const [isRecording, setIsRecording] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleRecordToggle = async () => {
    if (!isRecording) {
      try {
        // Get token from your backend
        const tokenRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/elevenlabsToken`
        );
        const { token } = await tokenRes.json();

        // Connect to WebSocket
        const ws = new WebSocket(
          `wss://api.elevenlabs.io/v1/speech-to-text/realtime?model_id=scribe_realtime_v2&sample_rate=16000`,
          ["token", token]
        );

        ws.onopen = async () => {
          // Get microphone stream
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: { sampleRate: 16000 },
          });
          streamRef.current = stream;

          // Setup audio processing
          const audioContext = new AudioContext({ sampleRate: 16000 });
          audioContextRef.current = audioContext;
          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN) {
              const audioData = e.inputBuffer.getChannelData(0);
              const pcm16 = new Int16Array(audioData.length);
              for (let i = 0; i < audioData.length; i++) {
                pcm16[i] = Math.max(
                  -32768,
                  Math.min(32767, audioData[i] * 32768)
                );
              }
              const base64 = btoa(
                String.fromCharCode(...new Uint8Array(pcm16.buffer))
              );
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "partial_transcript") {
            onTranscribe(data.text, false);
          } else if (data.type === "committed_transcript") {
            onTranscribe(data.text, true);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        wsRef.current = ws;
        setIsRecording(true);
      } catch (error) {
        console.error("Recording error:", error);
      }
    } else {
      // Stop recording
      wsRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    handleRecordToggle,
  };
}
