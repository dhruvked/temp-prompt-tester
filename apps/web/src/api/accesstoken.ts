async function fetchAccessToken() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/heygenToken`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const { token } = await response.json();
  return token;
}

export default fetchAccessToken;
