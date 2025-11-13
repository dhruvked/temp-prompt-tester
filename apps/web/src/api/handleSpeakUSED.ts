import type StreamingAvatar from "@heygen/streaming-avatar";
import { TaskMode, TaskType } from "@heygen/streaming-avatar";

export default async function handleSpeak(
  avatar: StreamingAvatar,
  text: string
) {
  console.log(text, avatar);
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
