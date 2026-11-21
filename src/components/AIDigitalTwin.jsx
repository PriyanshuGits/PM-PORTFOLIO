
import { useEffect, useRef, useState } from "react";

const initialMessage = {
  role: "assistant",
  text: "Hey! I'm PM's Digital Twin. Ask me about Priyanshu, his projects or technologies.",
};

const suggestions = [
  "Who is Priyanshu?",
  "Show me his projects",
  "What technologies does he use?",
  "Tell me about PM Watches",
];

const getResponse = (question) => {
  const q = question.toLowerCase();

  if (
    q.includes("who") ||
    q.includes("about") ||
    q.includes("priyanshu")
  ) {
    return "I'm Priyanshu Modi's digital portfolio assistant. Priyanshu is a Full-Stack Creative Developer who builds digital experiences combining creativity and technology.";
  }

  if (q.includes("project") || q.includes("work")) {
    return "Here are some of Priyanshu's projects:\n\n• PM Watches — An immersive 3D smartwatch website.\n• PM Nexora — A SaaS platform project.\n\nYou can explore them in the Projects section.";
  }

  if (
    q.includes("technology") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("skill")
  ) {
    return "Priyanshu works with technologies including React, JavaScript, Three.js and React Three Fiber. His focus is on creative web development and interactive digital experiences.";
  }

  if (q.includes("watch")) {
    return "PM Watches is an immersive smartwatch website featuring interactive 3D product visualization, built using React, Three.js and React Three Fiber.";
  }

  if (q.includes("nexora")) {
    return "PM Nexora is a SaaS project exploring modern software experiences, digital workflows and product-focused interfaces.";
  }

  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email")
  ) {
    return "You can reach Priyanshu through the Contact section of this portfolio.";
  }

  return "I don't have verified information about that yet. Try asking me about Priyanshu, his projects, technologies or experience.";
};

export default function AIDigitalTwin() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const sendMessage = (text = input) => {
    const question = text.trim();

    if (!question || isTyping) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);

    setInput("");
    setIsTyping(true);

    // Temporary local response.
    // Real AI backend will replace this in Step 3.
    setTimeout(() => {
      const response = getResponse(question);

      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: response },
      ]);

      setIsTyping(false);
    }, 700);
  };

  const clearChat = () => {
    setMessages([initialMessage]);
    setInput("");
  };

  return (
    <>
      {/* FLOATING AI BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        className="fixed bottom-24 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full border border-[#E53945]/50 bg-[#E53945] text-2xl text-white shadow-[0_0_35px_rgba(229,57,69,0.35)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_45px_rgba(229,57,69,0.55)]"
      >
        {isOpen ? "✕" : "✦"}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 z-[9998] flex h-[min(620px,75vh)] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#101010] shadow-2xl shadow-black/60">

          {/* HEADER */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-[#171717] p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E53945] text-xl text-white">
              ✦
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-white">
                PM Digital Twin
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-[10px] tracking-wider text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                PORTFOLIO ASSISTANT
              </p>
            </div>

            {/* CLEAR + CLOSE */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearChat}
                className="text-xs text-white/40 transition hover:text-[#E53945]"
              >
                CLEAR
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition hover:border-[#E53945] hover:bg-[#E53945]/10 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="text-center text-[9px] tracking-[3px] text-white/25">
              PM DIGITAL INTELLIGENCE
            </div>

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-[#E53945] text-white"
                      : "rounded-bl-sm border border-white/10 bg-[#1C1C1C] text-white/80"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="w-fit rounded-2xl rounded-bl-sm border border-white/10 bg-[#1C1C1C] px-4 py-3 text-sm text-[#E53945]">
                Thinking...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTIONS */}
          {messages.length === 1 && (
            <div className="space-y-2 px-4 pb-3">
              <p className="text-[10px] tracking-wider text-white/35">
                TRY ASKING
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="rounded-full border border-white/10 px-3 py-2 text-[10px] text-white/60 transition hover:border-[#E53945] hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INPUT */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-[#171717] p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me anything..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-white/30"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E53945] text-lg text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↗
            </button>
          </form>
        </div>
      )}
    </>
  );
}
