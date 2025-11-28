import { Center, Loader, Paper, Text } from "@mantine/core";
import { CommentForm } from "./CommentForm";
import { FeedbackForm } from "./FeedbackForm";
import { MessageActions } from "./MessageActions";
import { AnimatePresence, motion } from "framer-motion";
import { generateSpeech } from "@/api/helpers";

type Message = {
  id?: string;
  role: "developer" | "assistant";
  content: [{ type: "input_text" | "output_text"; text: string }];
};

interface ChatMessageProps {
  message: Message;
  isMobile: boolean;
  copiedId: string | null;
  feedback: any;
  commentForms: any;
  idealAnswerForms: any;
  metricsForms: any;
  expandedMetrics: string | null;
  onCopy: (id: string, text: string) => void;
  onThumbsUp: (id: string) => void;
  onThumbsDown: (id: string) => void;
  onCommentClick: (id: string) => void;
  onSaveComment: (id: string) => void;
  onCommentChange: (id: string, value: string) => void;
  onMetricsExpand: (id: string | null) => void;
  onMetricChange: (id: string, metric: string, value: number) => void;
  onIdealAnswerChange: (id: string, value: string) => void;
  onSaveIdealAnswer: (id: string) => void;
  onIdeadAnswerCancel: (id: string) => void;
  onCommentCancel: (id: string) => void;
  currentSpeakingId: string | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onSpeak: (text: string, id: string) => void;
  onCancelSpeak: () => void;
  loading: boolean;
}

export function ChatMessage(props: ChatMessageProps) {
  const {
    message,
    isMobile,
    copiedId,
    feedback,
    commentForms,
    idealAnswerForms,
    metricsForms,
    expandedMetrics,
    onCopy,
    onThumbsUp,
    onThumbsDown,
    onCommentClick,
    onSaveComment,
    onCommentChange,
    onMetricsExpand,
    onMetricChange,
    onIdealAnswerChange,
    onSaveIdealAnswer,
    onIdeadAnswerCancel,
    onCommentCancel,
    currentSpeakingId,
    audioRef,
    onSpeak,
    onCancelSpeak,
    loading,
  } = props;

  const msgId = message.id ?? `msg-${Math.random()}`;
  const isAssistant = message.role === "assistant";
  const fbk = feedback.find((f: any) => f.messageId === msgId);

  // const handlePlayTTS = async () => {
  //   try {
  //     if (audioRef.current) {
  //       const oldSrc = audioRef.current.src;
  //       audioRef.current.pause();
  //       audioRef.current.src = "";
  //       audioRef.current = null;
  //       if (oldSrc) URL.revokeObjectURL(oldSrc);
  //       return;
  //     }

  //     // Start new audio
  //     const text = message.content[0].text;
  //     const blob = await generateSpeech(text);
  //     const audioUrl = URL.createObjectURL(blob);

  //     const audio = new Audio(audioUrl);

  //     // Attach handlers BEFORE setting ref and playing
  //     audio.onended = () => {
  //       URL.revokeObjectURL(audioUrl);
  //       onToggleSpeaking();
  //       audioRef.current = null;
  //     };

  //     audio.onerror = (e) => {
  //       URL.revokeObjectURL(audioUrl);
  //       onToggleSpeaking();
  //       audioRef.current = null;
  //     };

  //     audioRef.current = audio;
  //     onToggleSpeaking();

  //     await audio.play();
  //   } catch (err) {
  //     console.error("TTS error:", err);
  //     onToggleSpeaking();
  //     if (audioRef.current) {
  //       audioRef.current = null;
  //     }
  //   }
  // };
  const handlePlayTTS = () => {
    if (audioRef.current) {
      onCancelSpeak(); // stop current speech
    } else {
      onSpeak(message.content[0].text, msgId); // speak message
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "100%",
        maxWidth: "900px",
        display: "flex",
        margin: "0 auto",
        justifyContent:
          message.role === "developer" ? "flex-end" : "flex-start",
      }}
    >
      <Paper
        p={isMobile ? "sm" : "md"}
        radius={isMobile ? "md" : "lg"}
        shadow={isAssistant ? "sm" : "none"}
        bg={isAssistant ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.5)"}
        style={{
          maxWidth: isMobile ? "90%" : "78%",
          backdropFilter: isAssistant ? "blur(10px)" : "none",
        }}
      >
        <Text
          c="white"
          size={isMobile ? "xs" : "sm"}
          style={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}
        >
          {message.content[0].text}
        </Text>

        {isAssistant && (
          <>
            <MessageActions
              msgId={msgId}
              isMobile={isMobile}
              copiedId={copiedId}
              feedback={fbk}
              onCopy={() => onCopy(msgId, message.content[0].text)}
              onThumbsUp={() => onThumbsUp(msgId)}
              onThumbsDown={() => onThumbsDown(msgId)}
              onCommentClick={() => onCommentClick(msgId)}
              onPlayTTS={handlePlayTTS}
              isSpeaking={currentSpeakingId === msgId}
            />

            <AnimatePresence mode="popLayout">
              {commentForms.hasOwnProperty(msgId) && (
                <motion.div
                  key="comment"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: "hidden" }}
                >
                  <CommentForm
                    isMobile={isMobile}
                    msgId={msgId}
                    value={commentForms[msgId]}
                    onChange={(value) => onCommentChange(msgId, value)}
                    onSave={() => onSaveComment(msgId)}
                    onCancel={() => onCommentCancel(msgId)}
                  />
                </motion.div>
              )}

              {fbk?.isUseful === false &&
                idealAnswerForms.hasOwnProperty(msgId) && (
                  <motion.div
                    key="feedback"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <FeedbackForm
                      isMobile={isMobile}
                      msgId={msgId}
                      metricsForms={metricsForms}
                      expandedMetrics={expandedMetrics}
                      idealAnswer={idealAnswerForms[msgId]}
                      onMetricsExpand={() =>
                        onMetricsExpand(
                          expandedMetrics === msgId ? null : msgId
                        )
                      }
                      onMetricChange={(metric, value) =>
                        onMetricChange(msgId, metric, value)
                      }
                      onIdealAnswerChange={(value) =>
                        onIdealAnswerChange(msgId, value)
                      }
                      onSave={() => onSaveIdealAnswer(msgId)}
                      onCancel={() => onIdeadAnswerCancel(msgId)}
                    />
                  </motion.div>
                )}
            </AnimatePresence>
          </>
        )}
      </Paper>
    </motion.div>
  );
}
