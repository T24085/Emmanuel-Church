"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  assistantChatUrl,
  assistantName,
  assistantStorageKey,
  assistantSystemPrompt,
  buildLocalFallbackReply,
  churchSiteKey,
  starterPrompts,
} from "@/data/chat";
import { site } from "@/data/site";

type ChatRole = "assistant" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  source?: "ollama" | "fallback" | "seed";
  model?: string;
};

const urlPattern = /(https?:\/\/[^\s<>()]+|www\.[^\s<>()]+)/g;

function nowLabel(value: number) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(value);
}

function safeStorageGet(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function safeStorageSet(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures.
  }
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeUrl(url: string) {
  return url.startsWith("www.") ? `https://${url}` : url;
}

function splitTrailingPunctuation(value: string) {
  const match = value.match(/^(.*?)([.,;:!?]+)?$/);

  if (!match) {
    return { url: value, suffix: "" };
  }

  return {
    url: match[1],
    suffix: match[2] ?? "",
  };
}

function renderMessageContent(content: string): ReactNode {
  const lines = content.split(/\r?\n/);

  return lines.map((line, lineIndex) => {
    const pieces: ReactNode[] = [];
    let lastIndex = 0;
    const matches = [...line.matchAll(new RegExp(urlPattern))];

    for (const match of matches) {
      const rawUrl = match[0];
      const startIndex = match.index ?? 0;
      const endIndex = startIndex + rawUrl.length;

      if (startIndex > lastIndex) {
        pieces.push(line.slice(lastIndex, startIndex));
      }

      const { url, suffix } = splitTrailingPunctuation(rawUrl);
      const href = normalizeUrl(url);
      pieces.push(
        <a
          key={`${lineIndex}-${startIndex}-${rawUrl}`}
          className="church-chat__link"
          href={href}
          target="_blank"
          rel="noreferrer noopener"
        >
          {url}
        </a>,
      );

      if (suffix) {
        pieces.push(suffix);
      }

      lastIndex = endIndex;
    }

    if (lastIndex < line.length) {
      pieces.push(line.slice(lastIndex));
    }

    if (!pieces.length) {
      return <br key={`line-${lineIndex}`} />;
    }

    return (
      <span key={`line-${lineIndex}`}>
        {pieces}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </span>
    );
  });
}

function getInitialMessages(): ChatMessage[] {
  return [
    {
      id: createId("assistant"),
      role: "assistant",
      content:
        "Hi, I'm Emmanuel Guide. Ask me about service times, ministries, giving, contact details, or upcoming events.",
      createdAt: Date.now(),
    },
  ];
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const serializedState = useMemo(
    () =>
      JSON.stringify({
        sessionId,
        messages,
        isExpanded,
      }),
    [isExpanded, messages, sessionId],
  );

  useEffect(() => {
    const raw = safeStorageGet(assistantStorageKey);
    if (!raw) {
      setSessionId(createId("session"));
      setMessages(getInitialMessages());
      return;
    }

    try {
      const parsed = JSON.parse(raw) as Partial<{
        sessionId: string;
        messages: ChatMessage[];
        isExpanded: boolean;
      }>;

      setSessionId(typeof parsed.sessionId === "string" && parsed.sessionId ? parsed.sessionId : createId("session"));
      setMessages(Array.isArray(parsed.messages) && parsed.messages.length ? parsed.messages : getInitialMessages());
      setIsExpanded(parsed.isExpanded !== false);
    } catch {
      setSessionId(createId("session"));
      setMessages(getInitialMessages());
    }
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    safeStorageSet(assistantStorageKey, serializedState);
  }, [serializedState, sessionId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) {
      return;
    }

    el.scrollTop = el.scrollHeight;
  }, [messages, isOpen, isExpanded]);

  useEffect(() => {
    if (isOpen) {
      window.setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [isOpen]);

  async function sendMessage(userText: string) {
    const trimmed = userText.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: createId("user"),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsSending(true);

    try {
      const payload = {
        assistant: assistantName,
        sessionId: sessionId || createId("session"),
        pageUrl: window.location.href,
        siteKey: churchSiteKey,
        siteName: site.name,
        clientProfile: {
          name: "Visitor",
          email: "Unknown",
          phone: "Unknown",
        },
        systemPrompt: assistantSystemPrompt,
        messages: nextMessages,
      };

      const candidateResponse = await fetch(assistantChatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!candidateResponse.ok) {
        throw new Error(`Chat request failed with status ${candidateResponse.status} for ${assistantChatUrl}`);
      }

      const data = (await candidateResponse.json()) as {
        content?: string;
        reply?: string;
        message?: string;
        usedFallback?: boolean;
        model?: string;
      };
      const replyText = data.content || data.reply || data.message || "";

      if (!replyText.trim()) {
        throw new Error(`Chat request returned an empty response for ${assistantChatUrl}`);
      }

      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: replyText,
          createdAt: Date.now(),
          source: data.usedFallback ? "fallback" : "ollama",
          model: data.model?.trim() || assistantChatUrl,
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: createId("assistant"),
          role: "assistant",
          content: buildLocalFallbackReply(trimmed),
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }

    event.preventDefault();
    void sendMessage(draft);
  }

  function handlePrompt(prompt: string) {
    setIsOpen(true);
    void sendMessage(prompt);
  }

  function resetConversation() {
    const nextSessionId = createId("session");
    const nextMessages = getInitialMessages();
    setSessionId(nextSessionId);
    setMessages(nextMessages);
    setDraft("");
    safeStorageSet(
      assistantStorageKey,
      JSON.stringify({
        sessionId: nextSessionId,
        messages: nextMessages,
        isExpanded: true,
      }),
    );
  }

  return (
    <div className="church-chat">
      {!isOpen ? (
        <button className="church-chat__launcher" type="button" onClick={() => setIsOpen(true)}>
          <span className="church-chat__launcherDot" aria-hidden="true">
            <svg className="church-chat__launcherIcon" viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path d="M12 3.5C7.3 3.5 3.5 6.9 3.5 11c0 2.2 1 4.1 2.8 5.5l-.5 3.5 3.4-1.7c.9.2 1.9.2 2.8.2 4.7 0 8.5-3.4 8.5-7.5S16.7 3.5 12 3.5Z" />
              <path d="M8.2 10.7h7.6M8.2 13.6h5.2" />
            </svg>
          </span>
          <span className="church-chat__launcherCopy">
            <strong>Chat with Emmanuel Guide</strong>
            <span>Services, events, ministries, giving.</span>
          </span>
        </button>
      ) : (
        <section className="church-chat__panel" aria-label="Emmanuel Church assistant">
          <header className="church-chat__header">
            <div>
              <p className="church-chat__eyebrow">Emmanuel Church Assistant</p>
              <h2>Emmanuel Guide</h2>
              <p className="church-chat__lede">
                Ask about the church, upcoming events, service times, or how to get connected.
              </p>
            </div>
            <button className="church-chat__close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg className="church-chat__closeIcon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </header>

          <div className="church-chat__meta" aria-label="Chat status">
            <span>Site: {site.name}</span>
            <span>{isSending ? "Thinking..." : "Ready to help"}</span>
          </div>

          <div className="church-chat__messages" ref={messagesRef} aria-live="polite">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`church-chat__message church-chat__message--${message.role}`}
              >
                <div className="church-chat__bubble">
                  <div className="church-chat__bubbleMeta">
                    <span>{message.role === "assistant" ? assistantName : "You"}</span>
                    <span>{nowLabel(message.createdAt)}</span>
                  </div>
                  <div className="church-chat__content">{renderMessageContent(message.content)}</div>
                </div>
              </article>
            ))}
            {isSending ? (
              <article className="church-chat__message church-chat__message--assistant">
                <div className="church-chat__bubble church-chat__bubble--thinking">
                  <div className="church-chat__bubbleMeta">
                    <span>{assistantName}</span>
                    <span>Now</span>
                  </div>
                  <div className="church-chat__typing" aria-label="Assistant is typing">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </article>
            ) : null}
          </div>

          <div className="church-chat__suggestions">
            <button
              className="church-chat__suggestionsToggle"
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
            >
              <span>Helpful prompts</span>
              <span>{isExpanded ? "Hide" : "Show"}</span>
            </button>
            {isExpanded ? (
              <div className="church-chat__suggestionsList">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="church-chat__chip"
                    type="button"
                    onClick={() => handlePrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <form className="church-chat__composer" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="church-chat-input">
              Ask Emmanuel Guide
            </label>
            <textarea
              id="church-chat-input"
              ref={textareaRef}
              className="church-chat__input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Ask a question about Emmanuel Church..."
              rows={3}
            />
            <div className="church-chat__footer">
              <div className="church-chat__footerNote">
                <p>Need details fast? Ask about service times, address, calendar, or ministries.</p>
              </div>
              <div className="church-chat__footerActions">
                <button className="church-chat__reset button button--light" type="button" onClick={resetConversation}>
                  Reset
                </button>
                <button className="church-chat__send button button--gold" type="submit" disabled={isSending || !draft.trim()}>
                  <svg className="church-chat__sendIcon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M4.5 12 19.5 4.5 15.2 19.5l-4.2-5.4L4.5 12Z" />
                  </svg>
                  <span>Send</span>
                </button>
              </div>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
