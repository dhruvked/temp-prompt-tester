"use client";
import terminateAvatarSession from "@/api/terminateAvatarSession";
import initializeAvatarSession from "@/api/initializeAvatarSession";
import { ActionIcon, Grid, Group, SimpleGrid, Stack } from "@mantine/core";
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
  isMobile,
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
    <Grid
      align="center"
      w={isMobile ? "100%" : "40vw"}
      justify="center"
      maw="550px"
    >
      <Grid.Col span={isMobile ? 6 : 12}>
        <VideoOutput videoRef={videoRef} isMobile={isMobile} />
      </Grid.Col>

      <Grid.Col
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: isMobile ? "12px" : "0px",
        }}
        span={isMobile ? 6 : 12}
      >
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
      </Grid.Col>
    </Grid>
  );
}
