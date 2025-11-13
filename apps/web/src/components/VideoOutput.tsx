import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import { ActionIcon, Loader } from "@mantine/core";

const VideoOutput = ({ videoRef, status, initAvatar, endAvatar }: any) => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        height: "80%",
        width: "120px",
        borderRadius: "8px",
        backgroundColor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          objectFit: "cover",
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoOutput;
