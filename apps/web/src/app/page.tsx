"use client";
import {
  Group,
  Center,
  Stack,
  Input,
  ActionIcon,
  Textarea,
  Button,
  Text,
} from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState, useEffect, useRef } from "react";
import { getResponse, setPrompt, getPrompt } from "@/api/getResponse";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingPrompt, setIsSavingPrompt] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [prompt, setPromptState] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = async () => {
    setIsLoading(true);
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 0.1);
    }, 100);

    const result = await getResponse(input);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setResponse(result);
    setIsLoading(false);
  };

  const get_p = async () => {
    const result = await getPrompt();
    setPromptState(result);
  };

  const set_p = async () => {
    setIsSavingPrompt(true);
    await setPrompt(prompt);
    setIsSavingPrompt(false);
    setShowPrompt(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSend();
    }
  };

  useEffect(() => {
    if (showPrompt) {
      get_p();
    }
  }, [showPrompt]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <Center h="100vh">
      <Stack align="stretch" w={600} h="100%" pt="lg">
        <Button onClick={() => setShowPrompt(!showPrompt)}>
          {showPrompt ? "Back" : "Prompt"}
        </Button>
        {showPrompt ? (
          <Stack>
            <Textarea
              placeholder="Enter your prompt here"
              minRows={20}
              autosize
              maxRows={30}
              value={prompt}
              onChange={(e) => setPromptState(e.target.value)}
            />
            <Button onClick={set_p} loading={isSavingPrompt}>
              Change Prompt
            </Button>
          </Stack>
        ) : (
          <>
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
          </>
        )}
      </Stack>
    </Center>
  );
}
