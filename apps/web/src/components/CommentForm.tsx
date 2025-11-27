import { Stack, Textarea, Group, Button } from "@mantine/core";

interface CommentFormProps {
  isMobile: boolean;
  msgId: string;
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function CommentForm({
  isMobile,
  msgId,
  value,
  onChange,
  onSave,
  onCancel,
}: CommentFormProps) {
  return (
    <Stack
      gap="xs"
      mt="sm"
      p="sm"
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.06)",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <Textarea
        placeholder="Enter your comments..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        rows={isMobile ? 2 : 3}
        size={isMobile ? "xs" : "sm"}
        radius="md"
        autosize={false}
        style={{ width: "100%" }} // <-- ensures full width
        onFocus={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")
        }
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")
        }
        styles={{
          input: {
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(4px)",
            transition: "border-color 150ms ease",
            fontSize: isMobile ? "12px" : "14px",
          },
        }}
      />

      <Group gap="xs" justify="flex-end">
        <Button
          size="xs"
          radius="sm"
          variant="default"
          onClick={onCancel}
          style={{
            backdropFilter: "blur(4px)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
            transition: "0.2s ease",
          }}
          className="mono-btn"
        >
          Cancel
        </Button>

        <Button
          size="xs"
          radius="sm"
          variant="default"
          onClick={onSave}
          style={{
            backdropFilter: "blur(4px)",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "white",
            transition: "0.2s ease",
          }}
          className="mono-btn-strong"
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}
