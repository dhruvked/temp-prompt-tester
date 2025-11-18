import { Group, Button, Stack, Textarea, Text } from "@mantine/core";

interface FeedbackFormProps {
  isMobile: boolean;
  msgId: string;
  metricsForms: any;
  expandedMetrics: string | null;
  idealAnswer: string;
  onMetricsExpand: () => void;
  onMetricChange: (metric: string, value: number) => void;
  onIdealAnswerChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function FeedbackForm({
  isMobile,
  msgId,
  metricsForms,
  expandedMetrics,
  idealAnswer,
  onMetricsExpand,
  onMetricChange,
  onIdealAnswerChange,
  onSave,
  onCancel,
}: FeedbackFormProps) {
  const MetricsButtons = ({
    metric,
  }: {
    metric: "correctness" | "relevance" | "tone";
  }) => (
    <div>
      <Text size="xs" fw={500} mb="xs">
        {metric.charAt(0).toUpperCase() + metric.slice(1)}
      </Text>
      <Group gap="xs">
        {[1, 2, 3, 4, 5].map((rating) => {
          const selected = (metricsForms[msgId]?.[metric] || 0) === rating;

          return (
            <Button
              key={rating}
              size="xs"
              onClick={() => onMetricChange(metric, rating)}
              variant="default"
              styles={{
                root: {
                  background: selected
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "white",
                  backdropFilter: "blur(6px)",
                  transition: "0.2s",
                  "&:hover": {
                    background: selected
                      ? "rgba(255,255,255,0.24)"
                      : "rgba(255,255,255,0.12)",
                  },
                },
              }}
            >
              {rating}
            </Button>
          );
        })}
      </Group>
    </div>
  );

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
      {!isMobile ? (
        <Stack gap="xs">
          <MetricsButtons metric="correctness" />
          <MetricsButtons metric="relevance" />
          <MetricsButtons metric="tone" />
        </Stack>
      ) : (
        <Button
          size="xs"
          variant="subtle"
          color="gray"
          onClick={onMetricsExpand}
          styles={{
            root: {
              color: "white",
              opacity: 0.8,
              "&:hover": { opacity: 1 },
            },
          }}
        >
          {expandedMetrics === msgId ? "Hide Metrics" : "Show Metrics"}
        </Button>
      )}

      {isMobile && expandedMetrics === msgId && (
        <Stack gap="xs">
          <MetricsButtons metric="correctness" />
          <MetricsButtons metric="relevance" />
          <MetricsButtons metric="tone" />
        </Stack>
      )}

      <Textarea
        placeholder="Enter the ideal answer..."
        value={idealAnswer}
        onChange={(e) => onIdealAnswerChange(e.currentTarget.value)}
        rows={isMobile ? 2 : 3}
        size={isMobile ? "xs" : "sm"}
        radius="md"
        styles={{
          input: {
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(6px)",
            transition: "border-color 120ms ease",
            fontSize: isMobile ? "12px" : "14px",
            "&:focus": {
              borderColor: "rgba(255,255,255,0.18)",
            },
          },
        }}
      />

      {/* Action Buttons */}
      <Group gap="xs" justify="flex-end" mt="sm">
        <Button
          size="xs"
          radius="sm"
          variant="default"
          onClick={onCancel}
          styles={{
            root: {
              backdropFilter: "blur(4px)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              transition: "0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.10)",
              },
            },
          }}
        >
          Cancel
        </Button>

        <Button
          size="xs"
          radius="sm"
          variant="default"
          onClick={onSave}
          styles={{
            root: {
              backdropFilter: "blur(4px)",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "white",
              fontWeight: 500,
              transition: "0.2s ease",
              "&:hover": {
                background: "rgba(255,255,255,0.22)",
              },
            },
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  );
}
