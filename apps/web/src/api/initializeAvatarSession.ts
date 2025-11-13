import fetchAccessToken from "./accesstoken";
import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents,
  TaskType,
} from "@heygen/streaming-avatar";
import { handleStreamReady } from "./handleStreamReady";
import React from "react";

async function initializeAvatarSession(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  setStatus: (status: string) => void
) {
  const token = await fetchAccessToken();
  const avatar: StreamingAvatar = new StreamingAvatar({ token });
  avatar.on(StreamingEvents.STREAM_READY, (event) => {
    setStatus("active");
    handleStreamReady(videoRef, event);
  });

  avatar.on(StreamingEvents.AVATAR_START_TALKING, (event) => {
    setStatus("speaking");
  });

  avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (event) => {
    setStatus("active");
  });

  const sessionData: any = await avatar.createStartAvatar({
    quality: AvatarQuality.Low,
    avatarName: "Wayne_20240711",
  });

  return avatar;
}

export default initializeAvatarSession;
