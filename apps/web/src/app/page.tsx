"use client";
import {
  Group,
  Center,
  Stack,
  Input,
  ActionIcon,
  Textarea,
  Text,
  Button,
  Checkbox,
  Rating,
  Paper,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState, useRef, useEffect } from "react";

async function getResponse(text: string) {
  const session_id = crypto.randomUUID();
  const input = [
    {
      role: "developer",
      content: [{ type: "input_text", text }],
    },
  ];

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/getResponse7`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input,
        id: "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        accountId: "435f83e7-6361-4d99-8bdf-12ea1328f0c7",
      }),
    }
  );
  const data = await response.json();
  return data;
}

async function storeFeedback(
  messageId: string,
  feedback: {
    accuracy: number;
    comments: string;
    idealAnswer: string;
    isUseful: boolean;
  }
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/storeFeedback`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId, feedback }),
    }
  );
  const data = await response.json();
  return data;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [messageId, setMessageId] = useState<string | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [comments, setComments] = useState("");
  const [idealAnswer, setIdealAnswer] = useState("");
  const [isUseful, setIsUseful] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setElapsedTime(0);
    setShowFeedback(false);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 0.1);
    }, 100);

    try {
      const result = await getResponse(input);
      setResponse(result.text);
      setMessageId(result.messageId);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!messageId) return;
    setIsSavingFeedback(true);

    try {
      await storeFeedback(messageId, {
        accuracy,
        comments,
        idealAnswer,
        isUseful,
      });
      setShowFeedback(false);
      setAccuracy(0);
      setComments("");
      setIdealAnswer("");
      setIsUseful(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingFeedback(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Center h="100vh">
      <Stack align="stretch" w={600} h="100%" pt="lg" pb="lg">
        <Group gap="xs">
          <Input
            size="md"
            placeholder="text here"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1 }}
          />
          <ActionIcon size="lg" onClick={handleSend} loading={isLoading}>
            <IconSend />
          </ActionIcon>
        </Group>
        {isLoading && (
          <Text size="sm" c="dimmed">
            Loading... {elapsedTime.toFixed(1)}s
          </Text>
        )}
        <Textarea
          placeholder="Response"
          minRows={15}
          autosize
          maxRows={25}
          readOnly
          value={response}
        />
        {response && !showFeedback && (
          <Button onClick={() => setShowFeedback(true)} variant="light">
            Give Feedback
          </Button>
        )}

        {showFeedback && (
          <Paper p="md" radius="md" bg="black">
            <Stack gap="md">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Accuracy
                </Text>
                <Rating value={accuracy} onChange={setAccuracy} />
              </div>

              <Textarea
                label="Comments"
                placeholder="Additional comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                minRows={2}
              />

              <Textarea
                label="Ideal Answer"
                placeholder="What would be a better response?"
                value={idealAnswer}
                onChange={(e) => setIdealAnswer(e.target.value)}
                minRows={2}
              />

              <Checkbox
                label="Like?"
                checked={isUseful}
                onChange={(e) => setIsUseful(e.currentTarget.checked)}
              />

              <Group justify="flex-end">
                <Button
                  variant="default"
                  onClick={() => setShowFeedback(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitFeedback}
                  loading={isSavingFeedback}
                >
                  Submit Feedback
                </Button>
              </Group>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Center>
  );
}
