import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import { ActionIcon, Loader } from "@mantine/core";

const VideoOutput = ({ videoRef, status }: any) => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        height: "80%",
        width: "140px",
        borderRadius: "12px",
        background: "rgba(15, 15, 15, 0.8)",
        backdropFilter: "blur(4px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoOutput;
