"use client";
import handleSpeak from "@/api/handleSpeak";
import { Button, Group, Input } from "@mantine/core";
import { useRef } from "react";

export default function TextInput({
  avatar,
  setStatus,
  setCaption,
  speakQueue,
  mediaIndex,
  mediaUrl,
}: any) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value;
      inputRef.current.value = "";
      setStatus("thinking");
      if (inputValue.trim()) {
        setCaption(inputValue);
        await handleSpeak(
          avatar,
          inputValue,
          speakQueue,
          setStatus,
          mediaUrl,
          mediaIndex
        );
      }
    }
  };

  return (
    <Group>
      <Input
        ref={inputRef}
        w="75%"
        placeholder="Type"
        onFocus={() => {
          setStatus("listening to text");
        }}
        onBlur={() => {
          setStatus("active");
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        // disabled={!(status === "active" || status === "listening to text")}
      />
      <Button
        w="20%"
        onClick={handleSubmit}
        // disabled={!(status === "active" || status === "listening to text")}
      >
        Send
      </Button>
    </Group>
  );
}
