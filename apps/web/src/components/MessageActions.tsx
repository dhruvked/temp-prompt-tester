import { ActionIcon, Group, Loader } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
  IconVolume,
  IconPlayerStop,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface MessageActionsProps {
  msgId: string;
  isMobile: boolean;
  copiedId: string | null;
  feedback: any;
  onCopy: () => void;
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  onCommentClick: () => void;
  onPlayTTS?: () => void;
  isSpeaking: boolean;
}

export function MessageActions({
  msgId,
  isMobile,
  copiedId,
  feedback,
  onCopy,
  onThumbsUp,
  onThumbsDown,
  onCommentClick,
  onPlayTTS,
  isSpeaking,
}: MessageActionsProps) {
  const iconSize = isMobile ? 14 : 16;
  const btnSize = isMobile ? "xs" : "sm";
  const [isPreparing, setIsPreparing] = useState(false);

  useEffect(() => {
    setIsPreparing(false);
  }, [isSpeaking]);

  return (
    <Group
      justify="space-between"
      align="center"
      mt="sm"
      gap={isMobile ? "xs" : "sm"}
      opacity={0.95}
    >
      {/* COPY BUTTON */}
      <ActionIcon
        size={btnSize}
        variant="subtle"
        color="gray.5"
        onClick={onCopy}
        title="Copy text"
        radius="md"
      >
        {copiedId === msgId ? (
          <IconCheck size={iconSize} />
        ) : (
          <IconCopy size={iconSize} />
        )}
      </ActionIcon>

      {/* FEEDBACK GROUP */}
      <Group gap={isMobile ? "xs" : "xs"} justify="flex-end">
        <ActionIcon
          size={btnSize}
          radius="md"
          variant="subtle"
          color={feedback?.isUseful === true ? "white" : "gray.5"}
          onClick={onThumbsUp}
          title="Mark useful"
        >
          <IconThumbUp size={iconSize} />
        </ActionIcon>

        <ActionIcon
          size={btnSize}
          radius="md"
          variant="subtle"
          color={feedback?.isUseful === false ? "white" : "gray.5"}
          onClick={onThumbsDown}
          title="Mark not useful"
        >
          <IconThumbDown size={iconSize} />
        </ActionIcon>

        <ActionIcon
          size={btnSize}
          radius="md"
          variant="subtle"
          color={feedback?.comments ? "white" : "gray.5"}
          onClick={onCommentClick}
          title="Add comment"
        >
          <IconMessageCircle size={iconSize} />
        </ActionIcon>
        <ActionIcon
          size={isMobile ? "xs" : "sm"}
          variant="subtle"
          color={isSpeaking ? "red" : "gray.5"}
          radius="md"
          onClick={() => {
            setIsPreparing(true);
            onPlayTTS?.();
          }}
          title={isSpeaking ? "Stop audio" : "Play audio"}
          style={{
            animation: isSpeaking ? "pulse 1.5s ease-in-out infinite" : "none",
          }}
        >
          {isPreparing && !isSpeaking ? (
            <Loader size="xs" color="white" />
          ) : isSpeaking ? (
            <IconPlayerStop size={iconSize} />
          ) : (
            <IconVolume size={iconSize} />
          )}
        </ActionIcon>
      </Group>
    </Group>
  );
}
