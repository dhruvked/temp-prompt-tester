import { ActionIcon, Group } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
  IconVolume,
} from "@tabler/icons-react";

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
}: MessageActionsProps) {
  const iconSize = isMobile ? 14 : 16;
  const btnSize = isMobile ? "xs" : "sm";

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
          color="grey"
          onClick={() => onPlayTTS?.()}
          title="Play audio"
        >
          <IconVolume size={isMobile ? 14 : 16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
