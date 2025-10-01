import React, { useState, useRef, useEffect } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { FaHeadset } from "react-icons/fa6";
import Input from "../../components/ui/input/Input";

const faqItems = [
  {
    id: 1,
    question: "How do I create a new ad campaign?",
    keywords: ["create", "campaign", "ad", "new"],
    solution:
      "Navigate to 'Campaigns' > 'Create New'. Set your budget, target audience, and ad creative. Submit for review.",
  },
  {
    id: 2,
    question: "Why are my ads not visible?",
    keywords: ["ads", "not visible", "hidden", "display"],
    solution:
      "Check your campaign status (pending/approved). Ensure your budget isn’t exhausted and targeting matches your audience.",
  },
  {
    id: 3,
    question: "How can I change device or location settings?",
    keywords: ["device", "location", "settings", "targeting", "adjust"],
    solution:
      "Go to 'Settings' > 'Targeting'. Adjust device types (iOS/Android) and geolocation preferences.",
  },
  {
    id: 4,
    question: "When can I withdraw my earnings?",
    keywords: ["withdraw", "earnings", "payout", "wallet", "payment"],
    solution:
      "Earnings are available 30 days after ad display. Withdraw via 'Wallet' > 'Payout' (minimum $10).",
  },
  {
    id: 5,
    question: "Revenue calculation seems incorrect. What should I do?",
    keywords: ["revenue", "calculation", "incorrect", "report", "discrepancy"],
    solution:
      "Compare your dashboard with raw logs in 'Reports'. Contact support if discrepancies persist.",
  },
  {
    id: 6,
    question: "How do I pause or stop an active campaign?",
    keywords: ["pause", "stop", "active", "campaign", "suspend"],
    solution:
      "Go to 'Campaigns' > select the campaign > click 'Pause' or 'Stop' to halt ad delivery.",
  },
  {
    id: 7,
    question: "Can I edit a campaign after it is live?",
    keywords: ["edit", "campaign", "live", "modify", "update"],
    solution:
      "Yes, select the live campaign and click 'Edit'. Note that some changes may require review before applying.",
  },
  {
    id: 8,
    question: "How can I track my ad performance?",
    keywords: ["track", "performance", "analytics", "report", "dashboard"],
    solution:
      "Go to 'Reports' or 'Analytics' to view metrics such as impressions, clicks, conversions, and ROI.",
  },
  {
    id: 9,
    question: "Is there a mobile app for managing campaigns?",
    keywords: ["mobile", "app", "campaign", "manage", "application"],
    solution:
      "Yes, download our iOS or Android app from the App Store or Google Play to manage campaigns on the go.",
  },
  {
    id: 10,
    question: "How do I contact support for urgent issues?",
    keywords: ["contact", "support", "urgent", "help", "assistance"],
    solution:
      "Click on 'Help' > 'Contact Support' in the dashboard. For urgent matters, use the live chat or call support directly.",
  },
];

const ChatOption = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, How may I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Keyword-based matching
  const getBotReply = (userText: string) => {
    const lowerText = userText.toLowerCase();

    // Find FAQ with the most matching keywords
    let bestMatch: any = null;
    let maxMatches = 0;

    faqItems.forEach((faq) => {
      const matches = faq.keywords.filter((kw) =>
        lowerText.includes(kw.toLowerCase())
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = faq;
      }
    });

    if (bestMatch && maxMatches > 0) return bestMatch.solution;

    return "I'm not sure about that. Please contact support for assistance.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      const botMessage = { sender: "bot", text: getBotReply(input.trim()) };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="shadow-lg w-full max-w-md flex flex-col rounded-xl overflow-hidden bg-white border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 bg-[#E3E8F3] px-6 py-4 text-gray-600">
        <FaHeadset className="h-6 w-6" />
        <span>Chat</span>
      </div>

      {/* Messages */}
      <div className="flex flex-col bg-gray-50">
        <div
          ref={messagesContainerRef}
          className="overflow-y-auto flex flex-col gap-4 px-6 py-4 h-[400px]"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === "bot" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {msg.sender === "bot" ? (
                  <div className="bg-[#465376] h-10 w-10 rounded-full flex items-center justify-center">
                    <FaHeadset className="h-4 w-4 text-white font-extralight" />
                  </div>
                ) : (
                  <img
                    src="logo.svg"
                    alt="User"
                    className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                  />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`px-3 py-2 rounded-lg max-w-[75%] break-words text-sm font-light shadow ${
                  msg.sender === "bot"
                    ? "bg-[#F8FAFC] text-gray-600"
                    : "bg-[#C7D1E8] text-gray-600"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="bg-[#445E94] h-10 w-10 rounded-full flex items-center justify-center">
                <FaHeadset className="h-5 w-5 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl max-w-[50%] bg-white text-gray-800 text-sm border border-gray-200">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputProps={{
              onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") sendMessage();
              },
            }}
            icon={
              <LuSendHorizontal
                onClick={sendMessage}
                className="h-5 w-5 cursor-pointer text-gray-700 font-extralight"
              />
            }
            iconPosition="right"
            className="origin-center font-light"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatOption;