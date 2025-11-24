"use client";
import {
  AppShell,
  AppShellMain,
  ScrollArea,
  Stack,
  Paper,
  Text,
  Loader,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
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

export default function ChatPage() {
  const session_idRef = useRef<string>(crypto.randomUUID());
  const isMobile = useMediaQuery("(max-width: 640px)");
  const viewport = useRef<HTMLDivElement>(null);
  const { speak, cancelSpeech, currentSpeakingId, audioRef } = useSpeech();
  const isVoiceModeRef = useRef(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const enableAudio = () => {
    // unlock audio on iOS/Android
    const a = new Audio();
    a.play().catch(() => {});
    setAudioEnabled(true);
  };

  const handleVoiceTranscript = (text: string) => {
    chatHandleSend(text);
  };

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
                transition={{ duration: 0.25 }}
                style={{
                  position: "relative",
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
                    display: "inline-block",
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
                animate={{ opacity: 0.35 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: "absolute",
                  top: "35%",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  pointerEvents: "none", // ✅ does NOT block input
                }}
              >
                <Text
                  c="white"
                  style={{
                    fontSize: isMobile ? "18px" : "22px",
                    fontWeight: 500,
                    opacity: 0.6,
                  }}
                >
                  Welcome!
                  <br />
                  Type a message or tap the mic to begin
                </Text>
              </motion.div>
            )}
          </AnimatePresence>

          <ScrollArea
            flex={1}
            viewportRef={viewport}
            px={isMobile ? "xs" : "md"}
            styles={{
              root: { border: "none", background: "transparent" },
              viewport: { background: "transparent" },
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
              style={{ paddingBottom: 250 }}
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
                <Loader type="dots" color="white" size="sm" ml="sm" />
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
