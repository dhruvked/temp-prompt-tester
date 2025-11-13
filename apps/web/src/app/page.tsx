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
  Textarea,
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
  IconCheck,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { getResponse, storeFeedback } from "@/api/helpers";
import VideoComponenet from "@/components/VideoComponent";
import handleSpeak from "@/api/handleSpeakUSED";

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<any>(null);

  const [messageFeedback, setMessageFeedback] = useState<
    {
      messageId: string;
      isUseful?: boolean | null;
      comments?: string;
      idealAnswer?: string;
    }[]
  >([]);
  const [commentForms, setCommentForms] = useState<{ [key: string]: string }>(
    {}
  );
  const [idealAnswerForms, setIdealAnswerForms] = useState<{
    [key: string]: string;
  }>({});

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

      if (avatar) {
        await handleSpeak(avatar, response.text);
      }
      updatedMessages = [...updatedMessages, assistantMessage];
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCommentClick = (messageId: string) => {
    if (commentForms.hasOwnProperty(messageId)) {
      const updated = { ...commentForms };
      delete updated[messageId];
      setCommentForms(updated);
    } else {
      setCommentForms({
        ...commentForms,
        [messageId]: getFeedback(messageId)?.comments || "",
      });
    }
  };

  const handleSaveComment = (messageId: string) => {
    const commentText = commentForms[messageId]?.trim();
    setFeedbackForMessage(messageId, {
      comments: commentText || null,
    });
    const updated = { ...commentForms };
    delete updated[messageId];
    setCommentForms(updated);
  };

  const handleCopy = (messageId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(messageId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveIdealAnswer = (messageId: string) => {
    const answerText = idealAnswerForms[messageId]?.trim();
    setFeedbackForMessage(messageId, {
      idealAnswer: answerText || null,
    });
    const updated = { ...idealAnswerForms };
    delete updated[messageId];
    setIdealAnswerForms(updated);
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
        {/* <VideoComponenet avatar={avatar} setAvatar={setAvatar} /> */}
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
                  <Group justify="space-between">
                    <ActionIcon
                      size="sm"
                      variant="subtle"
                      color="grey"
                      onClick={() => handleCopy(msg.id!, msg.content[0].text)}
                    >
                      {copiedId === msg.id ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy />
                      )}
                    </ActionIcon>
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
                          if (current !== false) {
                            setIdealAnswerForms({
                              ...idealAnswerForms,
                              [msg.id!]:
                                getFeedback(msg.id!)?.idealAnswer || "",
                            });
                          }
                        }}
                      >
                        <IconThumbDown />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="subtle"
                        color={
                          getFeedback(msg.id!)?.comments ? "white" : "grey"
                        }
                        onClick={() => handleCommentClick(msg.id!)}
                      >
                        <IconMessageCircle />
                      </ActionIcon>
                    </Group>
                  </Group>
                )}

                {commentForms.hasOwnProperty(msg.id!) && (
                  <Stack gap="xs" mt="sm">
                    <Textarea
                      placeholder="Enter your comments..."
                      value={commentForms[msg.id!] || ""}
                      onChange={(e: any) =>
                        setCommentForms({
                          ...commentForms,
                          [msg.id!]: e.currentTarget.value,
                        })
                      }
                      rows={3}
                      size="xs"
                    />
                    <Group gap="xs" justify="flex-end">
                      <Button
                        size="xs"
                        variant="default"
                        onClick={() => {
                          const updated = { ...commentForms };
                          delete updated[msg.id!];
                          setCommentForms(updated);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="xs"
                        onClick={() => handleSaveComment(msg.id!)}
                      >
                        Save
                      </Button>
                    </Group>
                  </Stack>
                )}

                {getFeedback(msg.id!)?.isUseful === false &&
                  idealAnswerForms.hasOwnProperty(msg.id!) && (
                    <Stack gap="xs" mt="sm">
                      <Textarea
                        placeholder="Enter the ideal answer..."
                        value={idealAnswerForms[msg.id!] || ""}
                        onChange={(e) =>
                          setIdealAnswerForms({
                            ...idealAnswerForms,
                            [msg.id!]: e.currentTarget.value,
                          })
                        }
                        rows={3}
                        size="xs"
                      />
                      <Group gap="xs" justify="flex-end">
                        <Button
                          size="xs"
                          variant="default"
                          onClick={() => {
                            const updated = { ...idealAnswerForms };
                            delete updated[msg.id!];
                            setIdealAnswerForms(updated);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="xs"
                          onClick={() => handleSaveIdealAnswer(msg.id!)}
                        >
                          Save
                        </Button>
                      </Group>
                    </Stack>
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
