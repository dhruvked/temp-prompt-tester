"use client";
import {
  ActionIcon,
  AppShell,
  AppShellHeader,
  AppShellMain,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  useMantineColorScheme,
  Paper,
  ScrollArea,
  Tabs,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconSun,
  IconMoon,
  IconSend,
  IconBookmark,
  IconSettings,
  IconThumbUp,
  IconThumbDown,
  IconCopy,
  IconMessage,
  IconMessageCircle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getResponse, storeFeedback } from "@/api/helpers";

type Message = {
  id?: string;
  role: "developer" | "assistant";
  content: [{ type: "input_text" | "output_text"; text: string }];
};

export default function ChatPage() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session_id] = useState(() => crypto.randomUUID());
  const viewport = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messageFeedback, setMessageFeedback] = useState<
    {
      messageId: string;
      isUseful?: boolean | null;
      comments?: string;
      idealAnswer?: string;
    }[]
  >([]);
  const [showComment, setShowComment] = useState(false);

  const getFeedback = (messageId: string) =>
    messageFeedback.find((f) => f.messageId === messageId);

  const setFeedbackForMessage = (messageId: string, feedback: any) => {
    const existing = messageFeedback.findIndex(
      (f) => f.messageId === messageId
    );
    if (existing >= 0) {
      const updated = [...messageFeedback];
      updated[existing] = { ...updated[existing], ...feedback };
      setMessageFeedback(updated);
    } else {
      setMessageFeedback([...messageFeedback, { messageId, ...feedback }]);
    }

    storeFeedback(messageId, feedback);
  };
  const scrollToBottom = () =>
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage: Message = {
      role: "developer",
      content: [{ type: "input_text", text: input }],
    };

    let updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await getResponse(
        updatedMessages,
        "3e532144-2181-48eb-be56-66edc3bab9dd",
        session_id,
        "435f83e7-6361-4d99-8bdf-12ea1328f0c7"
      );

      const assistantMessage: Message = {
        id: response.messageId,
        role: "assistant",
        content: [{ type: "output_text", text: response.text }],
      };

      updatedMessages = [...updatedMessages, assistantMessage];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell padding="md" header={{ height: 40 }}>
      <AppShellHeader>
        <Group h="100%" justify="space-between" px="xs" align="center">
          <ActionIcon
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            variant="transparent"
            c="white"
            size="lg"
            style={{
              transform: isSettingsOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
            }}
          >
            <IconSettings size={24} />
          </ActionIcon>
          <Text
            fw={700}
            size="lg"
            onClick={() => router.back()}
            style={{ cursor: "pointer" }}
          >
            Choreo Avatar
          </Text>
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size="sm"
            suppressHydrationWarning
          >
            {colorScheme === "dark" ? (
              <IconSun size={20} />
            ) : (
              <IconMoon size={20} />
            )}
          </ActionIcon>
        </Group>
      </AppShellHeader>
      <AppShellMain
        style={{
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 40px)",
        }}
      >
        <ScrollArea flex={1} viewportRef={viewport} px="md">
          <Stack gap="sm" py="md">
            {messages.map((msg, index) => (
              <Paper
                key={index}
                p="sm"
                radius="md"
                bg={msg.role === "developer" ? "blue" : "gray"}
                style={{
                  alignSelf:
                    msg.role === "developer" ? "flex-end" : "flex-start",
                  maxWidth: "70%",
                }}
              >
                <Text c="white" size="sm">
                  {msg.content[0].text}
                </Text>

                {msg.role === "assistant" && (
                  <Group gap="xs" mt="sm" justify="flex-end">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color={
                        getFeedback(msg.id!)?.isUseful === true
                          ? "white"
                          : "grey"
                      }
                      onClick={() => {
                        const current = getFeedback(msg.id!)?.isUseful;
                        setFeedbackForMessage(msg.id!, {
                          isUseful: current === true ? null : true,
                        });
                      }}
                    >
                      <IconThumbUp />
                    </ActionIcon>
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color={
                        getFeedback(msg.id!)?.isUseful === false
                          ? "white"
                          : "grey"
                      }
                      onClick={() => {
                        const current = getFeedback(msg.id!)?.isUseful;
                        setFeedbackForMessage(msg.id!, {
                          isUseful: current === false ? null : false,
                        });
                      }}
                    >
                      <IconThumbDown />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="subtle" color="grey">
                      <IconMessageCircle />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="subtle" color="grey">
                      <IconCopy />
                    </ActionIcon>
                  </Group>
                )}
              </Paper>
            ))}
            {loading && (
              <Paper
                p="sm"
                radius="md"
                bg="gray"
                style={{ alignSelf: "flex-start", maxWidth: "70%" }}
              >
                <Text c="white" size="sm">
                  ...
                </Text>
              </Paper>
            )}
          </Stack>
        </ScrollArea>

        <Stack
          gap="md"
          p="md"
          style={{ borderTop: "1px solid var(--mantine-color-gray-3)" }}
        >
          <Group gap="xs">
            <TextInput
              flex={1}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <ActionIcon
              size="lg"
              onClick={() => handleSend()}
              disabled={loading}
              title="Send message"
            >
              <IconSend size={20} />
            </ActionIcon>
          </Group>
        </Stack>
      </AppShellMain>
    </AppShell>
  );
}
