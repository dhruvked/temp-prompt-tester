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
    <Stack gap="xs" mt="sm">
      <Textarea
        placeholder="Enter your comments..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        rows={isMobile ? 2 : 3}
        size={isMobile ? "xs" : "sm"}
        radius="md"
        styles={{
          input: {
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.06)",
            fontSize: isMobile ? "12px" : "14px",
          },
        }}
      />
      <Group gap="xs" justify="flex-end">
        <Button
          size={isMobile ? "xs" : "xs"}
          variant="default"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button size={isMobile ? "xs" : "xs"} onClick={onSave}>
          Save
        </Button>
      </Group>
    </Stack>
  );
}
