import { Stack, Group, TextInput, ActionIcon, Textarea } from "@mantine/core";
import { IconMicrophone, IconSend } from "@tabler/icons-react";

interface InputAreaProps {
  isMobile: boolean;
  input: string;
  isRecording: boolean;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onRecordToggle: () => void;
  setInput: (input: string) => void;
}

export function InputArea({
  isMobile,
  input,
  isRecording,
  loading,
  onInputChange,
  onSend,
  onRecordToggle,
  setInput,
}: InputAreaProps) {
  return (
    <Stack
      gap={isMobile ? "xs" : "sm"}
      p={isMobile ? "xs" : "sm"}
      style={{
        borderRadius: isMobile ? "12px" : "18px",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        background: "rgba(18,18,22,0.5)",
      }}
    >
      <Group
        gap={isMobile ? "xs" : "sm"}
        align="center"
        style={{ width: "100%" }}
      >
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={isMobile ? "Message..." : "Type a message"}
          autosize
          minRows={1}
          maxRows={isMobile ? 4 : 6}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
              setInput("");
            }
          }}
          style={{ flex: 1, width: "100%" }}
          radius="lg"
          size={isMobile ? "sm" : "md"}
          styles={{
            input: {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(6px)",
              fontSize: isMobile ? "12px" : "14px",
            },
          }}
        />
        <ActionIcon
          size={isMobile ? "md" : "lg"}
          radius="xl"
          variant="filled"
          color={isRecording ? "red" : "rgba(255,255,255,0.06)"}
          onClick={onRecordToggle}
          title={isRecording ? "Stop recording" : "Start recording"}
          style={{
            animation: isRecording ? "pulseRecord 1.2s infinite" : "none",
          }}
        >
          <IconMicrophone size={isMobile ? 16 : 20} />
        </ActionIcon>
        <ActionIcon
          size={isMobile ? "md" : "lg"}
          radius="xl"
          variant="filled"
          color="rgba(255,255,255,0.06)"
          onClick={onSend}
          disabled={loading}
          title="Send message"
          style={{
            boxShadow: "0 6px 18px rgba(255,255,255,0.06)",
          }}
        >
          <IconSend size={isMobile ? 16 : 20} />
        </ActionIcon>
      </Group>
    </Stack>
  );
}
