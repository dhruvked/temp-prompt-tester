export function handleStreamDisconnected(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  if (videoRef) {
    videoRef.current!.srcObject = null;
    videoRef.current!.muted = true;
    videoRef.current!.load();
    videoRef.current!.play().catch(console.error);
  }
}
