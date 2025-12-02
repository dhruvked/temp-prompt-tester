import { Select, Button, Group } from "@mantine/core";
import { useState } from "react";
import handleSpeak from "@/api/handleSpeak"; // adjust import path

const MediaFormatSelect = ({
  avatar,
  setStatus,
  setCaption,
  abortRef,
  speakQueue,
  mediaUrl,
  mediaIndex,
}: any) => {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(
    "singleImage"
  );

  const formats = [
    { value: "singleImage", label: "Single Image" },
    { value: "singleVideo", label: "Single Video" },
    { value: "multipleImages", label: "Multiple Images" },
    { value: "multipleVideos", label: "Multiple Videos" },
    { value: "mixedMedia", label: "Mixed Media" },
    { value: "noMedia", label: "No Media" },
    { value: "differentFormats", label: "Different Formats" },
    { value: "differentResolutions", label: "Different Resolutions" },
    { value: "differentSizes", label: "Different Sizes" },
  ];

  const handleTest = async () => {
    try {
      await handleSpeak(
        avatar,
        selectedFormat || "singleImage",
        speakQueue,
        setStatus,
        mediaUrl,
        mediaIndex
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Group style={{ width: "100%" }} grow>
      <Select
        placeholder="Choose a format"
        data={formats}
        value={selectedFormat}
        onChange={setSelectedFormat}
      />
      <Button onClick={handleTest} fullWidth>
        Test
      </Button>
    </Group>
  );
};

export default MediaFormatSelect;
