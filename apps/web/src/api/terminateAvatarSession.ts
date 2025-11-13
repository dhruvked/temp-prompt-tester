import type StreamingAvatar from "@heygen/streaming-avatar";
import { handleStreamDisconnected } from "./handleStreamDisconnect";

async function terminateAvatarSession(
  avatar: StreamingAvatar,
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  if (!avatar) return;
  await avatar.stopAvatar();
  handleStreamDisconnected(videoRef);
  return null;
}

export default terminateAvatarSession;
