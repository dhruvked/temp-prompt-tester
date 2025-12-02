"use client";
import {
  AppShell,
  AppShellMain,
  ScrollArea,
  Stack,
  Paper,
  Text,
  Loader,
  Center,
} from "@mantine/core";
import { use, useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { ChatMessage } from "@/components/ChatMessage";
import { InputArea } from "@/components/InputArea";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useFeedback } from "@/hooks/useFeedback";
import { useRecording } from "@/hooks/useRecording";
import { fetchTokenFromServer } from "@/api/helpers";
import { useVoiceMode } from "@/hooks/useVoiceMode";
import { useSpeech } from "@/hooks/useSpeech";
import { AnimatePresence, motion } from "framer-motion";

type PageProps = {
  params: Promise<{ name: string }>;
};

export default function ChatPage({ params }: PageProps) {
  const { name } = use(params);
  const session_idRef = useRef<string>(crypto.randomUUID());
  const isMobile = useMediaQuery("(max-width: 640px)");
  const viewport = useRef<HTMLDivElement>(null);
  const { speak, cancelSpeech, currentSpeakingId, audioRef } = useSpeech();
  const isVoiceModeRef = useRef(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const enableAudio = async () => {
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

      setAudioEnabled(true);
    } catch (err) {
      console.error("Audio unlock failed:", err);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    chatHandleSend(text);
  };

  const showUserMessage = (text: string) => {};

  const [input, setInput] = useState("");
  const [voiceToken, setVoiceToken] = useState("");
  const { isVoiceMode, handleVoiceModeToggle, mute, toggleMute } = useVoiceMode(
    handleVoiceTranscript,
    voiceToken,
    setVoiceToken
  );

  const {
    messages,
    loading,
    handleSend: chatHandleSend,
  } = useChatMessages(session_idRef.current, speak, isVoiceModeRef);

  useEffect(() => {
    fetchTokenFromServer().then(setVoiceToken);
  }, []);

  const feedback = useFeedback();
  const { isRecording, handleRecordToggle } = useRecording(
    (text) => setInput(text),
    voiceToken,
    setVoiceToken
  );

  const scrollToBottom = () =>
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    isVoiceModeRef.current = isVoiceMode;
  }, [isVoiceMode]);

  const handleSend = async () => {
    const input_text = input;
    setInput("");
    await chatHandleSend(input_text);
  };

  const showWelcome = messages.length === 0 && !loading;
  const showAudioEnable = !audioEnabled && messages.length === 0 && !loading;

  return (
    <AppShell padding={isMobile ? "xs" : "sm"}>
      <AppShellMain style={{ height: "100vh" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            height: "100%",
          }}
        >
          <AnimatePresence>
            {showAudioEnable && isMobile && (
              <motion.div
                key="audio-enable"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "fixed",
                  top: 20,
                  textAlign: "center",
                  zIndex: 9999,
                }}
              >
                <Paper
                  onClick={enableAudio}
                  p="xs"
                  radius="lg"
                  shadow="md"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    cursor: "pointer",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Text c="white" size={isMobile ? "xs" : "sm"}>
                    Tap to enable voice
                  </Text>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showWelcome && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                style={{
                  position: "absolute",
                  top: "35%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  pointerEvents: "none",
                }}
              >
                <Text>Type a message or tap the mic to begin</Text>
              </motion.div>
            )}
          </AnimatePresence>

          <ScrollArea
            flex={1}
            viewportRef={viewport}
            px={isMobile ? "xs" : "md"}
            styles={{
              root: { border: "none", background: "transparent" },
              viewport: {
                background: "transparent",
                paddingBottom: 250,
              },
              scrollbar: { background: "transparent" },
              thumb: { background: "rgba(255,255,255,0.2)" },
            }}
            style={{
              background: "transparent",
              minHeight: 0,
              // marginBottom: isMobile ? "4px" : "6px",
            }}
          >
            <Stack
              gap={isMobile ? "xs" : "sm"}
              py="md"
              px={isMobile ? "xs" : "6px"}
            >
              {messages.map((msg, index) => (
                <ChatMessage
                  key={msg.id ?? `msg-${index}`}
                  message={msg}
                  isMobile={isMobile}
                  copiedId={feedback.copiedId}
                  feedback={feedback.messageFeedback}
                  commentForms={feedback.commentForms}
                  idealAnswerForms={feedback.idealAnswerForms}
                  metricsForms={feedback.metricsForms}
                  expandedMetrics={feedback.expandedMetrics}
                  onCopy={feedback.handleCopy}
                  onThumbsUp={feedback.handleThumbsUp}
                  onThumbsDown={feedback.handleThumbsDown}
                  onCommentClick={feedback.handleCommentClick}
                  onSaveComment={feedback.handleSaveComment}
                  onCommentChange={feedback.handleCommentChange}
                  onMetricsExpand={feedback.setExpandedMetrics}
                  onMetricChange={feedback.handleMetricChange}
                  onIdealAnswerChange={feedback.handleIdealAnswerChange}
                  onSaveIdealAnswer={feedback.handleSaveIdealAnswer}
                  onIdeadAnswerCancel={feedback.handleCancelIdealAnswer}
                  onCommentCancel={feedback.handleCancelComment}
                  audioRef={audioRef}
                  currentSpeakingId={currentSpeakingId}
                  onSpeak={speak}
                  onCancelSpeak={cancelSpeech}
                  loading={loading}
                />
              ))}

              {loading && (
                <Center>
                  <Loader type="dots" color="white" size="sm" ml="sm" />
                </Center>
              )}
            </Stack>
          </ScrollArea>

          <InputArea
            isMobile={isMobile}
            input={input}
            isRecording={isRecording}
            loading={loading}
            onInputChange={setInput}
            onSend={handleSend}
            onRecordToggle={handleRecordToggle}
            setInput={setInput}
            mute={mute}
            onToggleMute={toggleMute}
            isVoiceMode={isVoiceMode}
            onVoiceModeToggle={handleVoiceModeToggle}
          />
        </div>
      </AppShellMain>
    </AppShell>
  );
}
