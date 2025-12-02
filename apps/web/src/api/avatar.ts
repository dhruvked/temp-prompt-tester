export async function fetchAvatarByFrontendName(frontendName: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/avatars/by-name/${frontendName}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch avatar for "${frontendName}"`);
  }
  return res.json();
}
