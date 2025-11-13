"use client";
import terminateAvatarSession from "@/api/terminateAvatarSession";
import initializeAvatarSession from "@/api/initializeAvatarSession";
import { ActionIcon, Group, SimpleGrid, Stack } from "@mantine/core";
import React, { useState } from "react";
import VideoOutput from "./VideoOutput";
import {
  IconMicrophoneOff,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerStop,
  IconVolume,
  IconVolumeOff,
} from "@tabler/icons-react";
import { Tooltip } from "@mantine/core";

export default function VideoComponenet({
  avatar,
  setAvatar,
  status,
  setStatus,
}: any) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  const initAvatar = async () => {
    setStatus("initializing");
    setAvatar(await initializeAvatarSession(videoRef, setStatus));
  };

  const endAvatar = async () => {
    setStatus("Terminating");
    setAvatar(await terminateAvatarSession(avatar, videoRef));
    setStatus("idle");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <Group
      align="center"
      h="25vh"
      bg="rgba(0, 0, 0, 0.5)"
      justify="space-around"
      px="md"
      py="sm"
      style={{ borderRadius: "12px" }}
    >
      <VideoOutput
        videoRef={videoRef}
        status={status}
        initAvatar={initAvatar}
        endAvatar={endAvatar}
      />

      <SimpleGrid
        cols={2}
        spacing="sm"
        p="xs"
        bg="black"
        style={{
          borderRadius: "8px",
          border: "2px solid rgba(0, 0, 0, 0.4)",
        }}
      >
        <Tooltip label="Mute">
          <ActionIcon
            variant="subtle"
            color="white"
            onClick={toggleMute}
            disabled={status === "idle"}
          >
            {isMuted ? <IconVolumeOff /> : <IconVolume />}
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Play">
          <ActionIcon
            variant="subtle"
            color="white"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = true;
                videoRef.current.play().catch(console.error);
              }
              initAvatar();
            }}
            disabled={status !== "idle"}
          >
            <IconPlayerPlay />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Stop">
          <ActionIcon
            variant="subtle"
            color="white"
            onClick={endAvatar}
            disabled={status === "idle"}
          >
            <IconPlayerStop />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Interrupt">
          <ActionIcon
            variant="subtle"
            color="white"
            onClick={() => avatar?.interrupt?.()}
            disabled={status !== "speaking"}
          >
            <IconPlayerPause />
          </ActionIcon>
        </Tooltip>
      </SimpleGrid>
    </Group>
  );
}
