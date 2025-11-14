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
      px="md"
      py="sm"
      justify="space-between"
      style={{
        borderRadius: 16,
        background: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <VideoOutput
        videoRef={videoRef}
        status={status}
        initAvatar={initAvatar}
        endAvatar={endAvatar}
      />

      <SimpleGrid
        cols={2}
        spacing="xs"
        p="sm"
        style={{
          borderRadius: 12,
          background: "rgba(20,20,22,0.6)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <Tooltip label={isMuted ? "Unmute" : "Mute"} withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={toggleMute}
            disabled={status === "idle"}
            style={{ opacity: status === "idle" ? 0.35 : 1 }}
          >
            {isMuted ? <IconVolumeOff size={18} /> : <IconVolume size={18} />}
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Start" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => {
              videoRef.current && (videoRef.current.muted = true);
              videoRef.current?.play().catch(console.error);
              initAvatar();
            }}
            disabled={status !== "idle"}
            style={{ opacity: status !== "idle" ? 0.35 : 1 }}
          >
            <IconPlayerPlay size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Stop" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={endAvatar}
            disabled={status === "idle"}
            style={{ opacity: status === "idle" ? 0.35 : 1 }}
          >
            <IconPlayerStop size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Interrupt" withArrow>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => avatar?.interrupt?.()}
            disabled={status !== "speaking"}
            style={{ opacity: status !== "speaking" ? 0.35 : 1 }}
          >
            <IconPlayerPause size={18} />
          </ActionIcon>
        </Tooltip>
      </SimpleGrid>
    </Group>
  );
}
