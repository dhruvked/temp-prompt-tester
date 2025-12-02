export default async function handler(audioFile: File) {
  const formData = new FormData();
  formData.append("model_id", "scribe_v1");
  formData.append("file", audioFile);
  const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: new Headers({
      "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLAB_API_KEY as string,
    }),
    body: formData,
  });

  const data = await response.json();
  return data;
}
