// Keeps the Ask James conversation inside the chat server's payload limits.
export const CHAT_LIMITS = { maxMessages: 30, maxCharsPerMessage: 4000, maxTotalChars: 24000 } as const;

export interface ChatTurn { role: "user" | "assistant"; content: string; isError?: boolean }

/** Drop error notices, shorten long replies, and keep only the newest turns that fit. Last turn must be the user's. */
export function trimChatHistory(turns: ChatTurn[], limits = CHAT_LIMITS): { role: "user" | "assistant"; content: string }[] {
  const clean = turns
    .filter((t) => !t.isError && t.content.trim().length > 0)
    .map((t) => ({
      role: t.role,
      content: t.content.length > limits.maxCharsPerMessage
        ? t.content.slice(0, limits.maxCharsPerMessage - 20) + "\n…[shortened]"
        : t.content,
    }));
  const kept: typeof clean = [];
  let total = 0;
  for (let i = clean.length - 1; i >= 0; i--) {
    const t = clean[i];
    if (kept.length >= limits.maxMessages || total + t.content.length > limits.maxTotalChars) break;
    kept.unshift(t);
    total += t.content.length;
  }
  // Start on a user turn so the context reads naturally.
  while (kept.length > 1 && kept[0].role !== "user") kept.shift();
  return kept;
}
