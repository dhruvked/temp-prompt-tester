import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import { ActionIcon, Loader } from "@mantine/core";

const VideoOutput = ({ videoRef, isMobile }: any) => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        height: isMobile ? "20vh" : "75vh",
        width: "100%",
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
          objectFit: "contain",
          borderRadius: "12px",
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoOutput;
