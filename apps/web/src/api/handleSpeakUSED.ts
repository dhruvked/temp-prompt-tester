import type StreamingAvatar from "@heygen/streaming-avatar";
import { TaskMode, TaskType } from "@heygen/streaming-avatar";

export default async function handleSpeak(
  avatar: StreamingAvatar,
  text: string,
  status: string
) {
  if (status === "speaking") {
    avatar.interrupt();
  }
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
