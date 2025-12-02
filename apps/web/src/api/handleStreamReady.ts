export function handleStreamReady(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  event: any
) {
  if (event.detail && videoRef.current) {
    videoRef.current.srcObject = event.detail;
    videoRef.current.muted = false;

    videoRef.current.onloadedmetadata = async () => {
      try {
        await videoRef.current!.play();
      } catch (err) {
        console.error("Video play failed:", err); // full error object

        if (err instanceof DOMException) {
          console.log("Error name:", err.name); // e.g. "NotAllowedError"
          console.log("Error message:", err.message); // detailed reason
          console.log("Error stack:", err.stack); // trace where it happened
          console.log("Video element state:", {
            muted: videoRef.current?.muted,
            paused: videoRef.current?.paused,
            srcObject: videoRef.current?.srcObject,
          });
        }
      }
    };
  }
}
