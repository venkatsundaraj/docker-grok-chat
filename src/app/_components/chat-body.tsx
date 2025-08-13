"use client";

import { FC, useState, useEffect } from "react";
import { useChat } from "ai/react";
import Markdown from "react-markdown";

interface ChatBodyProps {}

const ChatBody: FC<ChatBodyProps> = () => {
  const [isTyping, setIsTyping] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    console.log(messages);
    setWidth(window.innerWidth);
  }, []);

  const onSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    setIsTyping(true);
    const promise = handleSubmit(e) as unknown as Promise<void>;
    promise.finally(() => setIsTyping(false));
  };
  return (
    <section className="w-screen h-screen flex items-center justify-center flex-col gap-6 bg-black">
      <div className="container px-4 py-4 min-h-[90vh] overflow-y-scroll scrollbar-hide">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-4 w-full  ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded-lg max-w-[80%] ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              <Markdown>{m.content}</Markdown>
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="text-left">
            <span className="inline-block p-2 rounded-lg bg-gray-200 text-black">
              AI is typing...
            </span>
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          value={input}
          onChange={handleInputChange}
          type="text"
          className="border border-white rounded-sm p-2"
          placeholder="Type your message..."
        />
        <button
          className="px-4 py-2 border border-white rounded-sm"
          disabled={isTyping}
        >
          submit
        </button>
      </form>
    </section>
  );
};

export default ChatBody;
