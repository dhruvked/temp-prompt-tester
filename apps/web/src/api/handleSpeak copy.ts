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
  setMediaUrl: (status: string) => void
) {
  try {
    const imageURL = await testResponse(text);
    setMediaUrl(imageURL);
    const quickPromise = getQuickResponse(text);
    const mainPromise = getResponse2(text);

    const quickResponse = await quickPromise;
    const quickSentences = quickResponse.split(/(?<=[.?!])\s+/);

    for (const sentence of quickSentences) {
      const trimmed = sentence.trim();
      if (trimmed) {
        speakQueue.current.push(trimmed);
        await avatar.speak({
          text: trimmed,
          task_type: TaskType.REPEAT,
          taskMode: TaskMode.SYNC,
        });
      }
    }

    const mainResponse = await mainPromise;
    const validatedResponse = await validateResponse(
      quickResponse,
      mainResponse
    );

    console.log(validateResponse);
    const validatedSentences = validatedResponse
      .split(/(?<=[.?!])\s+/)
      .slice(1);
    for (const sentence of validatedSentences) {
      const trimmed = sentence.trim();
      if (trimmed) {
        speakQueue.current.push(trimmed);
        await avatar.speak({
          text: trimmed,
          task_type: TaskType.REPEAT,
          taskMode: TaskMode.SYNC,
        });
      }
    }
  } catch (error) {
    throw error;
  }
}
