import type StreamingAvatar from "@heygen/streaming-avatar";
import { TaskMode, TaskType } from "@heygen/streaming-avatar";
import type { RefObject } from "react";
import {
  testResponse,
  getResponse,
  getResponse2,
  getQuickResponse,
  validateResponse,
} from "./getResponse";

export default async function handleSpeak(
  avatar: StreamingAvatar,
  text: string,
  speakQueue: RefObject<string[]>,
  setStatus: (status: string) => void,
  mediaUrl: RefObject<any[]>,
  mediaIndex: RefObject<number>
) {
  const response = await testResponse(text);
  try {
    // Set all media links at once
    mediaUrl.current = response.mediaLinks;
    const validatedSentences = response.response.split(/(?<=[.?!])\s+/);

    for (const sentence of validatedSentences) {
      let trimmed = sentence.trim();
      if (trimmed) {
        // const mediaMatch = trimmed.match(/\[(.*?)\]/);
        // if (mediaMatch) {
        //   const mediaId = mediaMatch[1];
        //   // trimmed = trimmed.replace(/\[.*?\]/g, "").trim();
        //   const urlIndex = response.mediaLinks.findIndex(
        //     (link: any) => link.id === mediaId
        //   );
        //   if (urlIndex !== -1) {
        //     mediaIndex.current = urlIndex;
        //   }
        // }
        speakQueue.current.push(trimmed);
        await avatar.speak({
          text: trimmed.replace(/\[.*?\]/g, "").trim(),
          task_type: TaskType.REPEAT,
          taskMode: TaskMode.SYNC,
        });
      }
    }
  } catch (error) {
    throw error;
  }
}
