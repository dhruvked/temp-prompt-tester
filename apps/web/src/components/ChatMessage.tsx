import { Paper, Text } from "@mantine/core";
import { CommentForm } from "./CommentForm";
import { FeedbackForm } from "./FeedbackForm";
import { MessageActions } from "./MessageActions";

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
}

export function ChatMessage({
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
}: ChatMessageProps) {
  const msgId = message.id ?? `msg-${Math.random()}`;
  const isAssistant = message.role === "assistant";
  const fbk = feedback.find((f: any) => f.messageId === msgId);


  return (
    <Paper
      p={isMobile ? "sm" : "md"}
      radius={isMobile ? "md" : "lg"}
      shadow="sm"
      bg="rgba(255,255,255,0.05)"
      style={{
        animation: "fadeIn 0.25s ease",
        alignSelf: message.role === "developer" ? "flex-end" : "flex-start",
        maxWidth: isMobile ? "90%" : "78%",
        border: isAssistant ? "1px solid rgba(255,255,255,0.08)" : "none",
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
          />

          {commentForms.hasOwnProperty(msgId) && (
            <CommentForm
              isMobile={isMobile}
              msgId={msgId}
              value={commentForms[msgId]}
              onChange={(value) => onCommentChange(msgId, value)}
              onSave={() => onSaveComment(msgId)}
              onCancel={() => onCommentCancel(msgId)}
            />
          )}

          {fbk?.isUseful === false &&
            idealAnswerForms.hasOwnProperty(msgId) && (
              <FeedbackForm
                isMobile={isMobile}
                msgId={msgId}
                metricsForms={metricsForms}
                expandedMetrics={expandedMetrics}
                idealAnswer={idealAnswerForms[msgId]}
                onMetricsExpand={() =>
                  onMetricsExpand(expandedMetrics === msgId ? null : msgId)
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
            )}
        </>
      )}
    </Paper>
  );
}
