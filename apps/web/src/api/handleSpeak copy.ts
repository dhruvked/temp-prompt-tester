import type StreamingAvatar from "@heygen/streaming-avatar";
import { TaskMode, TaskType } from "@heygen/streaming-avatar";
import type { RefObject } from "react";
import { getResponse2 } from "./getResponse";

export default async function handleSpeak(
  avatar: StreamingAvatar,
  text: string
) {
  try {
    await avatar.speak({
      text: text,
      task_type: TaskType.REPEAT,
      taskMode: TaskMode.SYNC,
    });
  } catch (error) {
    throw error;
  }
}
