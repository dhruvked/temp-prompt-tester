"use client";
import {
  AppShell,
  AppShellMain,
  ScrollArea,
  Stack,
  Paper,
  Text,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { ChatMessage } from "@/components/ChatMessage";
import { InputArea } from "@/components/InputArea";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useFeedback } from "@/hooks/useFeedback";
import { useRecording } from "@/hooks/useRecording";
import { fetchTokenFromServer } from "@/api/helpers";

export default function ChatPage() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const viewport = useRef<HTMLDivElement>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  const { messages, loading, handleSend: chatHandleSend } = useChatMessages();
  const [input, setInput] = useState("");
  const [voiceToken, setVoiceToken] = useState("");

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

  const handleSend = async () => {
    await chatHandleSend(input);
    setInput("");
  };

  return (
    <AppShell padding={isMobile ? "xs" : "sm"}>
      <AppShellMain style={{ height: "100vh" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            height: "100%",
          }}
        >
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
              paddingTop: "8px",
              paddingBottom: "8px",
              marginBottom: isMobile ? "4px" : "6px",
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
                />
              ))}

              {loading && (
                <Paper
                  p={isMobile ? "sm" : "md"}
                  radius={isMobile ? "md" : "lg"}
                  bg="rgba(30,30,34,0.6)"
                  shadow="sm"
                  style={{ alignSelf: "flex-start", maxWidth: "60%" }}
                >
                  <Text c="white" size={isMobile ? "xs" : "sm"}>
                    ...
                  </Text>
                </Paper>
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
            voiceMode={voiceMode}
            setVoiceMode={setVoiceMode}
          />
        </div>
      </AppShellMain>
    </AppShell>
  );
}
