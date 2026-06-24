import { site, serviceRhythm, ministryLinks } from "@/data/site";

export const churchSiteKey = "emmanuel-church";
export const assistantName = "Emmanuel Guide";
export const assistantStorageKey = "emmanuel-church-chat-state";
const isProduction = process.env.NODE_ENV === "production";
const defaultAssistantChatUrl = isProduction
  ? "https://chat.novatec.casa/api/assistant-chat"
  : "/api/church-chat";

export const assistantChatUrl =
  process.env.NEXT_PUBLIC_ASSISTANT_CHAT_URL?.trim() || defaultAssistantChatUrl;
export const assistantChatFallbackUrl = "http://127.0.0.1:8787/api/assistant-chat";
export const assistantLocalRouteUrl = "/api/church-chat";

export const assistantSystemPrompt = [
  "You are Emmanuel Guide, the website assistant for Emmanuel Church in Abilene, Kansas.",
  "Answer with warmth, clarity, and a church-friendly tone.",
  "Use only the church details provided in the conversation and do not invent facts.",
  "Prioritize service times, location, ministries, giving, contact details, and upcoming events.",
  "When asked about upcoming events, direct people to the church calendar if the answer is not already in the provided event details.",
  "Keep replies concise and practical.",
].join(" ");

export const starterPrompts = [
  "What time are Sunday services?",
  "Where is the church located?",
  "What ministries do you offer?",
  "What is coming up on the calendar?",
  "How do I give online?",
  "Who should I contact?",
];

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatServiceRhythm() {
  return serviceRhythm
    .map((item) => `${item.label}: ${item.value}${item.detail ? ` (${item.detail})` : ""}`)
    .join("; ");
}

function formatList(items: { label: string }[]) {
  return items.map((item) => item.label).join(", ");
}

export function buildLocalFallbackReply(userText: string) {
  const query = cleanText(userText).toLowerCase();

  if (!query) {
    return `I'm here to help with Emmanuel Church details, upcoming events, service times, ministries, giving, and contact information.`;
  }

  if (query.includes("service") || query.includes("time") || query.includes("sunday") || query.includes("when")) {
    return `Emmanuel Church meets at ${formatServiceRhythm()}. ${site.address}`;
  }

  if (query.includes("where") || query.includes("located") || query.includes("address") || query.includes("map")) {
    return `Emmanuel Church is at ${site.address}. You can get directions here: ${site.mapHref}`;
  }

  if (query.includes("calendar") || query.includes("event") || query.includes("upcoming") || query.includes("coming up")) {
    return `The church calendar is the best place to check upcoming events: ${site.calendarHref}`;
  }

  if (query.includes("give") || query.includes("donation") || query.includes("tithe")) {
    return `Online giving is available here: ${site.givingHref}`;
  }

  if (query.includes("ministry") || query.includes("kids") || query.includes("youth") || query.includes("preschool") || query.includes("adult")) {
    return `Current ministry areas include ${formatList(ministryLinks)}.`;
  }

  if (query.includes("contact") || query.includes("email") || query.includes("phone")) {
    return `You can reach Emmanuel Church at ${site.phone} or use the contact page on the website.`;
  }

  if (query.includes("watch") || query.includes("stream") || query.includes("sermon")) {
    return `You can watch sermons and the live stream from the resources section.`;
  }

  if (query.includes("about") || query.includes("mission") || query.includes("who are you")) {
    return `${site.name} is ${site.tagline}. Our mission is ${site.mission}`;
  }

  return `I can help with service times, location, ministries, giving, contact details, and the church calendar. The quickest place to check events is ${site.calendarHref}.`;
}
