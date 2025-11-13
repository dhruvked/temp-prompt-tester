import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import { ActionIcon, Loader } from "@mantine/core";

const VideoOutput = ({ videoRef, status, initAvatar, endAvatar }: any) => {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        height: "300px",
        width: "190px",
        borderRadius: "8px",
        backgroundColor: "black",
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
          objectFit: "contain",
        }}
      >
        Your browser does not support the video tag.
      </video>

      {status === "idle" && (
        <ActionIcon
          onClick={() => {
            if (videoRef.current) {
              videoRef.current.muted = true; // start muted
              videoRef.current.play().catch(console.error);
            }
            initAvatar();
          }}
          variant="transparent"
          size="xl"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          <IconPlayerPlay size={40} />
        </ActionIcon>
      )}

      {status === "initializing" && (
        <ActionIcon
          variant="transparent"
          size="xl"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          <Loader size={40} color="grey" />
        </ActionIcon>
      )}

      {status !== "idle" && status !== "initializing" && (
        <>
          <ActionIcon
            onClick={endAvatar}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              color: "white",
            }}
          >
            <IconX size={24} />
          </ActionIcon>
        </>
      )}
    </div>
  );
};

export default VideoOutput;
