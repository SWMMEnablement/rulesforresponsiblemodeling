import { describe, expect, test } from "bun:test";
import { CHAT_LIMITS, trimChatHistory, type ChatTurn } from "../src/lib/chatHistory";

const long = (n: number) => "x".repeat(n);

describe("Ask James history trimming", () => {
  test("a long conversation stays within the server's 30 message / 4,000 / 24,000 character limits", () => {
    const turns: ChatTurn[] = [];
    for (let i = 0; i < 40; i++) turns.push({ role: "user", content: `q${i}` }, { role: "assistant", content: long(6000) });
    turns.push({ role: "user", content: "next question" });
    const out = trimChatHistory(turns);
    expect(out.length).toBeLessThanOrEqual(30);
    expect(out.every((m) => m.content.length <= 4000)).toBe(true);
    expect(out.reduce((s, m) => s + m.content.length, 0)).toBeLessThanOrEqual(24000);
    expect(out[out.length - 1]).toEqual({ role: "user", content: "next question" });
    expect(out[0].role).toBe("user");
  });

  test("error notices are never sent back to the server", () => {
    const out = trimChatHistory([
      { role: "user", content: "hi" },
      { role: "assistant", content: "Invalid messages payload", isError: true },
      { role: "user", content: "again" },
    ]);
    expect(out.map((m) => m.content)).toEqual(["hi", "again"]);
  });

  test("limits match the chat server", () => {
    expect(CHAT_LIMITS).toEqual({ maxMessages: 30, maxCharsPerMessage: 4000, maxTotalChars: 24000 });
  });
});
