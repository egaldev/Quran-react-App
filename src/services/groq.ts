export async function askGroq(message: string): Promise<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || "Server error");
  }

  const body = await res.json();

  // 🔥 INI YANG PALING PENTING
  return body.reply;
}
