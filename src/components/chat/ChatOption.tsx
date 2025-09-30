import React, { useState, useRef, useEffect } from "react";
import { LuSendHorizontal } from "react-icons/lu";
import { FaHeadset } from "react-icons/fa6";
import Input from "../../components/ui/input/Input";

// Predefined bot responses
const botReplies = [
  "Sure, let me check that for you.",
  "Currently, multiple team members can access the dashboard.",
  "You can reset your password from the settings page.",
  "Our team is working on that feature, stay tuned!",
];

const ChatOption = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi, How may I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotReply = () => {
    const index = Math.floor(Math.random() * botReplies.length);
    return botReplies[index];
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = { sender: "bot", text: getBotReply() };
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
      <div className="flex-1 flex flex-col bg-gray-50">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto flex flex-col gap-4 px-6 py-4"
          style={{ maxHeight: "600px" }} // fixed height
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
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
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

          {/* Typing indicator */}
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
        <div className="px-4">
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