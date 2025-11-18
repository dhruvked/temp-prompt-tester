import { useState } from "react";
import { storeFeedback } from "@/api/helpers";

type FeedbackItem = {
  messageId: string;
  isUseful?: boolean | null;
  comments?: string;
  idealAnswer?: string;
  correctness?: number;
  relevance?: number;
  tone?: number;
};

export function useFeedback() {
  const [messageFeedback, setMessageFeedback] = useState<FeedbackItem[]>([]);
  const [commentForms, setCommentForms] = useState<{ [key: string]: string }>(
    {}
  );
  const [idealAnswerForms, setIdealAnswerForms] = useState<{
    [key: string]: string;
  }>({});
  const [metricsForms, setMetricsForms] = useState<{
    [key: string]: { correctness: number; relevance: number; tone: number };
  }>({});
  const [expandedMetrics, setExpandedMetrics] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getFeedback = (messageId: string) =>
    messageFeedback.find((f) => f.messageId === messageId);

  const setFeedbackForMessage = (messageId: string, feedback: any) => {
    const existing = messageFeedback.findIndex(
      (f) => f.messageId === messageId
    );
    if (existing >= 0) {
      const updated = [...messageFeedback];
      updated[existing] = { ...updated[existing], ...feedback };
      setMessageFeedback(updated);
    } else {
      setMessageFeedback([...messageFeedback, { messageId, ...feedback }]);
    }

    storeFeedback(messageId, feedback);
  };

  const handleCommentClick = (messageId: string) => {
    if (commentForms.hasOwnProperty(messageId)) {
      const updated = { ...commentForms };
      delete updated[messageId];
      setCommentForms(updated);
    } else {
      setCommentForms({
        ...commentForms,
        [messageId]: getFeedback(messageId)?.comments || "",
      });
    }
  };

  const handleSaveComment = (messageId: string) => {
    const commentText = commentForms[messageId]?.trim();
    setFeedbackForMessage(messageId, {
      comments: commentText || null,
    });
    const updated = { ...commentForms };
    delete updated[messageId];
    setCommentForms(updated);
  };

  const handleCancelComment = (messageId: string) => {
    const updated = { ...commentForms };
    delete updated[messageId];
    setCommentForms(updated);
  };

  const handleCommentChange = (messageId: string, value: string) => {
    setCommentForms({
      ...commentForms,
      [messageId]: value,
    });
  };

  const handleThumbsUp = (messageId: string) => {
    const current = getFeedback(messageId)?.isUseful;
    setFeedbackForMessage(messageId, {
      isUseful: current === true ? null : true,
    });
  };

  const handleThumbsDown = (messageId: string) => {
    const current = getFeedback(messageId)?.isUseful;
    setFeedbackForMessage(messageId, {
      isUseful: current === false ? null : false,
    });
    if (current !== false) {
      setIdealAnswerForms({
        ...idealAnswerForms,
        [messageId]: getFeedback(messageId)?.idealAnswer || "",
      });
      setMetricsForms({
        ...metricsForms,
        [messageId]: {
          correctness: getFeedback(messageId)?.correctness || 0,
          relevance: getFeedback(messageId)?.relevance || 0,
          tone: getFeedback(messageId)?.tone || 0,
        },
      });
    }
  };

  const handleCopy = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMetricChange = (
    messageId: string,
    metric: string,
    value: number
  ) => {
    setMetricsForms({
      ...metricsForms,
      [messageId]: {
        ...metricsForms[messageId],
        [metric]: value,
      },
    });
  };

  const handleIdealAnswerChange = (messageId: string, value: string) => {
    setIdealAnswerForms({
      ...idealAnswerForms,
      [messageId]: value,
    });
  };

  const handleSaveIdealAnswer = (messageId: string) => {
    const answerText = idealAnswerForms[messageId]?.trim();
    const metrics = metricsForms[messageId] || {
      correctness: 0,
      relevance: 0,
      tone: 0,
    };
    setFeedbackForMessage(messageId, {
      idealAnswer: answerText || null,
      ...metrics,
    });
    const updated = { ...idealAnswerForms };
    delete updated[messageId];
    setIdealAnswerForms(updated);
    const updatedMetrics = { ...metricsForms };
    delete updatedMetrics[messageId];
    setMetricsForms(updatedMetrics);
    setExpandedMetrics(null);
  };

  const handleCancelIdealAnswer = (messageId: string) => {
    const updated = { ...idealAnswerForms };
    delete updated[messageId];
    setIdealAnswerForms(updated);
    const updatedMetrics = { ...metricsForms };
    delete updatedMetrics[messageId];
    setMetricsForms(updatedMetrics);
  };

  return {
    messageFeedback,
    commentForms,
    idealAnswerForms,
    metricsForms,
    expandedMetrics,
    copiedId,
    getFeedback,
    handleCommentClick,
    handleSaveComment,
    handleCancelComment,
    handleCommentChange,
    handleThumbsUp,
    handleThumbsDown,
    handleCopy,
    handleMetricChange,
    handleIdealAnswerChange,
    handleSaveIdealAnswer,
    handleCancelIdealAnswer,
    setExpandedMetrics,
  };
}
