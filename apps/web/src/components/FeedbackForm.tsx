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
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant={
              (metricsForms[msgId]?.[metric] || 0) === rating
                ? "filled"
                : "default"
            }
            size="xs"
            onClick={() => onMetricChange(metric, rating)}
          >
            {rating}
          </Button>
        ))}
      </Group>
    </div>
  );

  return (
    <Stack gap="xs" mt="sm">
      {!isMobile ? (
        <Stack gap="xs">
          <MetricsButtons metric="correctness" />
          <MetricsButtons metric="relevance" />
          <MetricsButtons metric="tone" />
        </Stack>
      ) : (
        <Button size="xs" variant="default" onClick={onMetricsExpand}>
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
