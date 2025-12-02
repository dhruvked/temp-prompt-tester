"use client";
import terminateAvatarSession from "@/api/terminateAvatarSession";
import initializeAvatarSession from "@/api/initializeAvatarSession";
import { Button, Stack, Group, Text, Badge, Paper } from "@mantine/core";
import React from "react";
import VoiceInput from "./VoiceInput";
import TextInput from "./TextInput";
import VideoOutput from "./VideoOutput";
import MediaFormatSelect from "./TestSelector";
import { fetchAvatarByFrontendName } from "@/api/avatar";

type VideoComponentProps = {
  name?: string;
};

export default function VideoComponenet({ name }: VideoComponentProps) {
  const [avatar, setAvatar] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string>("idle");
  const [caption, setCaption] = React.useState<string>("");
  const messageRef = React.useRef<number>(0);
  const mediaIndex = React.useRef<number>(-1);
  const speakQueue = React.useRef<string[]>([]);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const abortRef = React.useRef<AbortController>(new AbortController());
  const mediaUrl = React.useRef<any[]>([]);
  const [heygenName, setHeygenName] = React.useState<string | undefined>();
  const [avatarTable, setAvatarTable] = React.useState<any>();

  const initAvatar = async () => {
    console.log("name", name);
    setStatus("initializing");
    setAvatar(
      await initializeAvatarSession(
        videoRef,
        setStatus,
        setCaption,
        messageRef,
        speakQueue,
        mediaIndex,
        mediaUrl,
        avatarTable.heygenName
      )
    );
  };

  const endAvatar = async () => {
    setStatus("Terminating");
    setAvatar(await terminateAvatarSession(avatar, videoRef));
    setStatus("idle");
  };
  const interruptAvatar = async () => {
    await avatar.interrupt();
    setCaption("");
    speakQueue.current = [];
    mediaIndex.current = -1;
    mediaUrl.current = [];
  };

  React.useEffect(() => {
    if (!name) {
      setHeygenName(undefined);
      return;
    }

    fetchAvatarByFrontendName(name)
      .then((data) => {
        setAvatarTable(data);
      })
      .catch((err) => {
        console.error("Failed to fetch avatar by frontendName:", err);
        setHeygenName(undefined);
      });

    return;
  }, [name]);

  return (
    <Stack align="center" mt="lg" h="100vh">
      <Badge variant="transparent" color="gray" size="xl">
        {status}
      </Badge>
      <VideoOutput
        videoRef={videoRef}
        status={status}
        setStatus={setStatus}
        initAvatar={initAvatar}
        endAvatar={endAvatar}
        interruptAvatar={interruptAvatar}
        avatar={avatar}
        setCaption={setCaption}
        abortRef={abortRef}
        caption={caption}
        speakQueue={speakQueue}
        mediaUrl={mediaUrl}
        mediaIndex={mediaIndex}
      />
      <Stack w="350">
        <MediaFormatSelect
          avatar={avatar}
          setStatus={setStatus}
          setCaption={setCaption}
          abortRef={abortRef}
          speakQueue={speakQueue}
          mediaUrl={mediaUrl}
          mediaIndex={mediaIndex}
        />
        {/* <TextInput
          avatar={avatar}
          setStatus={setStatus}
          setCaption={setCaption}
          abortRef={abortRef}
          speakQueue={speakQueue}
          setMediaUrl={setMediaUrl}
          width="100%"
        /> */}

        {/* <Group grow>
          <VoiceInput
            avatar={avatar}
            status={status}
            setStatus={setStatus}
            setCaption={setCaption}
          />
          <Button
            onClick={async () => {
              await avatar.interrupt();
            }}
            disabled={!(status === "speaking")}
          >
            Stop Talking
          </Button>
        </Group> */}
      </Stack>
      {/* <Group>
        <Button onClick={initAvatar} disabled={!(status === "idle")}>
          Start Avatar Session
        </Button>
        <Button onClick={endAvatar} disabled={!(status === "active")}>
          Stop Avatar Session
        </Button>
      </Group> */}
      {/* <Paper shadow="xs" radius="md" p="xl">
        <Text>{caption}</Text>
      </Paper> */}
      {/* <Button onClick={() => setStatus("active")}></Button> */}
    </Stack>
  );
}
