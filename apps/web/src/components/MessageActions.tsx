import { ActionIcon, Group } from "@mantine/core";
import {
  IconCheck,
  IconCopy,
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
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
}: MessageActionsProps) {
  return (
    <Group
      justify="space-between"
      align="center"
      mt="sm"
      gap={isMobile ? "xs" : "sm"}
    >
      <ActionIcon
        size={isMobile ? "xs" : "sm"}
        variant="subtle"
        color="grey"
        onClick={onCopy}
        title="Copy text"
      >
        {copiedId === msgId ? (
          <IconCheck size={isMobile ? 14 : 16} />
        ) : (
          <IconCopy size={isMobile ? 14 : 16} />
        )}
      </ActionIcon>

      <Group
        gap={isMobile ? "xs" : "xs"}
        mt="sm"
        justify="flex-end"
        style={{ opacity: 0.92 }}
      >
        <ActionIcon
          size={isMobile ? "xs" : "sm"}
          variant="subtle"
          color={feedback?.isUseful === true ? "white" : "grey"}
          onClick={onThumbsUp}
          title="Mark useful"
        >
          <IconThumbUp size={isMobile ? 14 : 16} />
        </ActionIcon>

        <ActionIcon
          size={isMobile ? "xs" : "sm"}
          variant="subtle"
          color={feedback?.isUseful === false ? "white" : "grey"}
          onClick={onThumbsDown}
          title="Mark not useful"
        >
          <IconThumbDown size={isMobile ? 14 : 16} />
        </ActionIcon>

        <ActionIcon
          size={isMobile ? "xs" : "sm"}
          variant="subtle"
          color={feedback?.comments ? "white" : "grey"}
          onClick={onCommentClick}
          title="Add comment"
        >
          <IconMessageCircle size={isMobile ? 14 : 16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
