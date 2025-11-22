import {
  Stack,
  Group,
  TextInput,
  ActionIcon,
  Textarea,
  Button,
} from "@mantine/core";
import {
  IconCross,
  IconMicrophone,
  IconSend,
  IconSquare,
  IconVolume,
  IconVolumeOff,
  IconWaveSine,
  IconX,
} from "@tabler/icons-react";

interface InputAreaProps {
  isMobile: boolean;
  input: string;
  isRecording: boolean;
  loading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onRecordToggle: () => void;
  setInput: (input: string) => void;
  mute: boolean;
  onToggleMute: () => void;
  isVoiceMode: boolean;
  onVoiceModeToggle: () => void;
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
  mute,
  onToggleMute,
  isVoiceMode,
  onVoiceModeToggle,
}: InputAreaProps) {
  return (
    <Group
      gap="xs"
      align="center"
      wrap="nowrap"
      style={{
        maxWidth: isMobile ? "100%" : "700px",
        margin: "0 auto",
        padding: isMobile ? "8px" : "10px 12px",
        borderRadius: "24px",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        background: "rgba(20,20,24,0.6)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div
        style={{
          flex: 1,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: isVoiceMode ? 0 : 1,
          transform: isVoiceMode ? "scale(0.95)" : "scale(1)",
          display: isVoiceMode ? "none" : "block",
        }}
      >
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type a message..."
          autosize
          miw={isMobile ? "250px" : "300px"}
          minRows={1}
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
              setInput("");
            }
          }}
          radius="lg"
          size={isMobile ? "sm" : "md"}
          styles={{
            input: {
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.9)",
              fontSize: "16px",
              padding: "8px 12px",
              transition: "all 0.2s ease",
            },
          }}
        />
      </div>

      {isVoiceMode && (
        <ActionIcon
          size={isMobile ? 36 : 40}
          radius="xl"
          variant="subtle"
          color="gray"
          onClick={onToggleMute}
          title={mute ? "Unmute" : "Mute"}
          style={{
            transition: "all 0.2s ease",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {mute ? (
            <IconVolumeOff size={isMobile ? 18 : 20} />
          ) : (
            <IconVolume size={isMobile ? 18 : 20} />
          )}
        </ActionIcon>
      )}

      {!isVoiceMode && (
        <ActionIcon
          size={isMobile ? 36 : 40}
          radius="xl"
          variant="subtle"
          color={isRecording ? "red" : "gray"}
          onClick={onRecordToggle}
          title={isRecording ? "Stop recording" : "Start recording"}
          style={{
            animation: isRecording
              ? "pulseRecord 1.2s infinite"
              : "fadeIn 0.3s ease",
            transition: "all 0.2s ease",
          }}
        >
          {isRecording ? (
            <IconSquare size={isMobile ? 16 : 18} />
          ) : (
            <IconMicrophone size={isMobile ? 18 : 20} />
          )}
        </ActionIcon>
      )}

      {input ? (
        <ActionIcon
          size={isMobile ? 36 : 40}
          radius="xl"
          variant="filled"
          color="black"
          onClick={onSend}
          disabled={loading}
          title="Send message"
          style={{
            transition: "all 0.2s ease",
            transform: loading ? "scale(0.9)" : "scale(1)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          <IconSend size={isMobile ? 18 : 20} />
        </ActionIcon>
      ) : (
        <ActionIcon
          size={isMobile ? 36 : 40}
          radius="xl"
          variant="subtle"
          color="gray"
          onClick={onVoiceModeToggle}
          disabled={loading}
          title="Voice Mode"
          style={{
            transition: "all 0.2s ease",
            animation: "fadeIn 0.3s ease",
          }}
        >
          {isVoiceMode ? (
            <IconX size={isMobile ? 18 : 20} />
          ) : (
            <IconWaveSine size={isMobile ? 18 : 20} />
          )}
        </ActionIcon>
      )}
    </Group>
  );
}
