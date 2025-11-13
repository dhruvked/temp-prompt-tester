"use client";
import terminateAvatarSession from "@/api/terminateAvatarSession";
import initializeAvatarSession from "@/api/initializeAvatarSession";
import { Stack } from "@mantine/core";
import React from "react";
import VideoOutput from "./VideoOutput";

export default function VideoComponenet() {
  const [avatar, setAvatar] = React.useState<any>(null);
  const [status, setStatus] = React.useState<string>("idle");
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const initAvatar = async () => {
    setStatus("initializing");
    setAvatar(await initializeAvatarSession(videoRef, setStatus));
  };

  const endAvatar = async () => {
    setStatus("Terminating");
    setAvatar(await terminateAvatarSession(avatar, videoRef));
    setStatus("idle");
  };
  return (
    <Stack align="center" mt="lg" h="auto">
      <VideoOutput
        videoRef={videoRef}
        status={status}
        initAvatar={initAvatar}
        endAvatar={endAvatar}
      />
    </Stack>
  );
}
