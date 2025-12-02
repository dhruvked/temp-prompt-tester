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
  setStatus: (status: string) => void,
  setCaption: (status: string) => void,
  messageRef: React.RefObject<number>,
  speakQueue: React.RefObject<string[]>,
  mediaIndex: React.RefObject<number>,
  mediaUrl: any,
  heygenName?: string
) {
  let flag = true;
  let currentSessionId = 0;
  console.log(heygenName);
  const token = await fetchAccessToken();
  const avatar: StreamingAvatar = new StreamingAvatar({ token });
  avatar.on(StreamingEvents.STREAM_READY, (event) => {
    setStatus("active");
    handleStreamReady(videoRef, event);
  });

  avatar.on(StreamingEvents.AVATAR_START_TALKING, (event) => {
    if (flag === false) {
      speakQueue.current.shift();
    }
    flag = false;

    const sessionId = ++currentSessionId;

    setStatus("speaking");
    let prev = "";

    const mediaMatch = speakQueue.current[0]?.match(/\[(.*?)\]/);
    if (mediaMatch && mediaUrl.current) {
      const mediaId = mediaMatch[1];
      speakQueue.current[0] = speakQueue.current[0]
        .replace(/\s*\[.*?\]\s*/g, " ")
        .trim();
      const urlIndex = mediaUrl.current.findIndex(
        (link: any) => link.id === mediaId
      );
      if (urlIndex !== -1) {
        mediaIndex.current = urlIndex;
      }
    }
    // const words = speakQueue.current[0]?.split(/[ \-–—]/) as string[];
    const words = speakQueue.current[0]
      ?.split(/\s+/)
      .filter((w: string) => w.length > 0) as string[];

    let totalDelay = 0;
    words.forEach((word, index) => {
      totalDelay += 300;

      // Add current word's punctuation delay
      if (word.includes(",") || word.includes("-")) {
        totalDelay += 250;
      }

      if (word.length > 8) {
        totalDelay += 50;
      }

      setTimeout(() => {
        if (sessionId !== currentSessionId) return;

        prev += `${word} `;
        setCaption(prev);
        if (index === words.length - 1) {
          flag = true;
          speakQueue.current.shift();
        }
      }, totalDelay);
    });
  });

  avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (event) => {
    if (speakQueue.current.length === 0) {
      // if (flag) {
      //   setStatus("thinking");
      //   setCaption("");
      //   flag = false;
      // } else {
      setStatus("active");
      setCaption("");
      mediaIndex.current = -1;
      // }
    }
  });

  const sessionData: any = await avatar.createStartAvatar({
    quality: AvatarQuality.Low,
    avatarName: heygenName || "June_HR_public",
  });

  return avatar;
}

export default initializeAvatarSession;
