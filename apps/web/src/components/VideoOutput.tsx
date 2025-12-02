import {
  IconMicrophone,
  IconMicrophoneOff,
  IconPlayerPlay,
  IconSquare,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconSettings,
  IconLayout,
  IconTextCaption,
  IconChevronRight,
  IconChevronLeft,
  IconArrowsMinimize,
  IconMinimize,
  IconWindowMinimize,
  IconWindowMaximize,
} from "@tabler/icons-react";
import useVoiceInput from "./VoiceInput";
import { useState, useEffect } from "react";
import { ActionIcon, Loader } from "@mantine/core";

const VideoOutput = ({
  videoRef,
  status,
  setStatus,
  initAvatar,
  endAvatar,
  interruptAvatar,
  avatar,
  setCaption,
  caption,
  abortRef,
  speakQueue,
  mediaUrl,
  mediaIndex,
}: any) => {
  const { startRecording, stopRecording, isRecording } = useVoiceInput({
    avatar,
    setStatus,
    setCaption,
    abortRef,
    speakQueue,
    mediaUrl,
    mediaIndex,
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [position, setPosition] = useState("top-right");
  const [captionPosition, setCaptionPosition] = useState("bottom");
  const [captionOpen, setCaptionOpen] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const positions = [
    { label: "Top Left", value: "top-left" },
    { label: "Top Right", value: "top-right" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Right", value: "bottom-right" },
  ];

  useEffect(() => {
    if (mediaUrl.current && mediaUrl.current.length > 0) {
      setCurrentMediaIndex(0);
    }
  }, [mediaUrl.current]);

  useEffect(() => {
    if (mediaIndex.current === -1) {
      setIsMinimized(false);
    } else if (mediaIndex.current >= 0) {
      setCurrentMediaIndex(mediaIndex.current);
      setIsMinimized(true);
    }
  }, [mediaIndex.current]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        width: "380px",
        height: "677px",
      }}
    >
      <div
        style={{
          zIndex: 1,
          position: isMinimized ? "absolute" : "relative",
          display: "inline-block",
          width: isMinimized ? "200px" : "100%",
          height: isMinimized ? "113px" : "100%",
          transition: "all 0.3s ease",
          top:
            isMinimized && position.includes("top")
              ? "20px"
              : isMinimized && position.includes("bottom")
              ? "auto"
              : "auto",
          bottom: isMinimized && position.includes("bottom") ? "20px" : "auto",
          left: isMinimized && position.includes("left") ? "20px" : "auto",
          right: isMinimized && position.includes("right") ? "20px" : "auto",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            zIndex: 1,
            borderRadius: "8px",
            width: isMinimized ? "200px" : "100%",
            height: isMinimized ? "113px" : "100%",
            backgroundColor: "black",
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

        {status !== "idle" && status !== "initializing" && !isMinimized && (
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

            <ActionIcon
              onClick={() => setIsMinimized(!isMinimized)}
              variant="transparent"
              size="lg"
              style={{
                position: "absolute",
                bottom: "15px",
                right: "15px",
                color: "white",
              }}
            >
              <IconWindowMinimize size={24} />
            </ActionIcon>
          </>
        )}

        {status !== "idle" && status !== "initializing" && isMinimized && (
          <>
            <ActionIcon
              onClick={endAvatar}
              variant="transparent"
              size="sm"
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                color: "white",
              }}
            >
              <IconX size={16} />
            </ActionIcon>

            <ActionIcon
              onClick={() => setIsMinimized(!isMinimized)}
              variant="transparent"
              size="sm"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                color: "white",
              }}
            >
              <IconWindowMaximize size={16} />
            </ActionIcon>
          </>
        )}

        {!isMinimized && (
          <>
            <ActionIcon
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              variant="transparent"
              size="lg"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                color: "white",
                transform: isSettingsOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <IconSettings size={24} />
            </ActionIcon>

            {isSettingsOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",
                  right: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <ActionIcon
                  onClick={() => {
                    setLayoutOpen(false);
                    setCaptionOpen(!captionOpen);
                  }}
                  variant="transparent"
                  size="lg"
                  style={{ color: captionOpen ? "grey" : "white" }}
                  title="caption"
                >
                  <IconTextCaption size={24} />
                </ActionIcon>
                <ActionIcon
                  onClick={() => {
                    setLayoutOpen(!layoutOpen);
                    setCaptionOpen(false);
                  }}
                  variant="transparent"
                  size="lg"
                  style={{ color: layoutOpen ? "grey" : "white" }}
                  title="layout"
                >
                  <IconLayout size={24} />
                </ActionIcon>

                {captionOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "45px",
                      background: "rgba(0,0,0,0.9)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {["top", "bottom", "off"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setCaptionPosition(opt);
                          setCaptionOpen(false);
                        }}
                        style={{
                          background:
                            captionPosition === opt ? "white" : "transparent",
                          color: captionPosition === opt ? "black" : "white",
                          border: "1px solid white",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </button>
                    ))}
                  </div>
                )}

                {layoutOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "0px",
                      right: "45px",
                      background: "rgba(0,0,0,0.9)",
                      borderRadius: "8px",
                      padding: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {positions.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => {
                          setPosition(pos.value);
                          setLayoutOpen(false);
                        }}
                        style={{
                          background:
                            position === pos.value ? "white" : "transparent",
                          color: position === pos.value ? "black" : "white",
                          border: "1px solid white",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* {status === "active" && !isMinimized && (
          <ActionIcon
            onClick={startRecording}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              border: "1px solid rgba(128, 128, 128, 0.3)",
              backgroundColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            <IconMicrophone size={24} />
          </ActionIcon>
        )} */}

        {/* {status === "listening to voice" && (
          <ActionIcon
            onClick={stopRecording}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              backgroundColor: "rgba(239, 68, 68, 0.2)",
            }}
          >
            <IconMicrophoneOff size={24} />
          </ActionIcon>
        )} */}

        {status === "speaking" && (
          <ActionIcon
            onClick={interruptAvatar}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "white",
              border: "1px solid rgba(128, 128, 128, 0.3)",
              backgroundColor: "rgba(128, 128, 128, 0.2)",
            }}
          >
            <IconSquare size={24} />
          </ActionIcon>
        )}
      </div>
      {(status === "speaking" || status === "thinking") &&
        captionPosition !== "off" && (
          <div
            style={{
              position: "absolute",
              zIndex: 2,

              [captionPosition === "bottom" ? "bottom" : "top"]: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: "12px 16px",
              borderRadius: "8px",
              maxWidth: "80%",
              height: "3.9em",
              overflow: "hidden",
              textAlign: "center",
              fontSize: "12px",
              lineHeight: "1.5",
              wordWrap: "break-word",
              display: "flex",
              flexDirection: "column-reverse",
              alignItems: "center",
            }}
          >
            <div style={{ transition: "all 0.15s ease-out" }}>{caption}</div>
          </div>
        )}

      {isMinimized && mediaUrl.current && mediaUrl.current.length > 0 && (
        <>
          {/* Render all media elements */}
          {mediaUrl.current.map((media: any, index: number) => (
            <div
              key={index}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                zIndex: index === currentMediaIndex ? 0 : -1,
                opacity: index === currentMediaIndex ? 1 : 0,
                transition: "opacity 0.3s ease",
                pointerEvents: index === currentMediaIndex ? "auto" : "none",
              }}
            >
              {media.type === "video" ? (
                <video
                  src={media.url}
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                  autoPlay
                  muted
                  playsInline
                  controls={false}
                  loop
                />
              ) : (
                <img
                  src={media.url}
                  alt="media"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          ))}

          {/* Previous button */}
          <ActionIcon
            onClick={() =>
              setCurrentMediaIndex(Math.max(0, currentMediaIndex - 1))
            }
            disabled={currentMediaIndex === 0}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              color: "white",
              opacity: currentMediaIndex === 0 ? 0.5 : 1,
            }}
          >
            <IconChevronLeft size={24} />
          </ActionIcon>

          {/* Next button */}
          <ActionIcon
            onClick={() =>
              setCurrentMediaIndex(
                Math.min(mediaUrl.current.length - 1, currentMediaIndex + 1)
              )
            }
            disabled={currentMediaIndex === mediaUrl.current.length - 1}
            variant="transparent"
            size="lg"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              color: "white",
              opacity:
                currentMediaIndex === mediaUrl.current.length - 1 ? 0.5 : 1,
            }}
          >
            <IconChevronRight size={24} />
          </ActionIcon>

          {/* Media counter */}
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
              background: "rgba(0, 0, 0, 0.7)",
              color: "white",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {currentMediaIndex + 1} / {mediaUrl.current.length}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoOutput;
