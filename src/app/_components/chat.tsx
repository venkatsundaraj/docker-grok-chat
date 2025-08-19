"use client";

import { FC, useEffect, useRef, useState } from "react";

interface ChatProps {}

type Message =
  | {
      id: string | number;
      type: "system";
      message: string;
      timestamp: string;
      clientId: string;
    }
  | {
      id: string | number;
      type: "chat";
      username: string;
      message: string;
      timestamp: string;
      isOwn: boolean;
      clientId: string;
    };

const Chat: FC<ChatProps> = () => {
  const [username, setUsername] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [clientId, setClientId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(messages, clientId);
    const filter = messages.find((msg) => msg.clientId === clientId);
    console.log(filter);
  }, [messages, clientId]);

  useEffect(() => {
    const fetchData = async function () {
      const data = await fetch("/api/socket");

      const webSocket = new WebSocket("ws://192.168.1.6:3001");

      webSocket.onopen = () => {
        console.log("connected");
        setIsConnected(true);
      };

      webSocket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "welcome":
            console.log(data, data.clientId);
            setUsername(data.userName);
            setClientId(data.clientId);
            // addMessage({
            //   id: Date.now(),
            //   type: "system",
            //   message: data.message,
            //   timestamp: new Date().toISOString(),
            // });
            break;
          case "chat_message":
            console.log(data, data.clientId, clientId);
            addMessage({
              id: Date.now(),
              type: "chat",
              username: data.userName,
              message: data.message,
              timestamp: data.timestamp,
              isOwn: String(data.userName) === String(username),
              clientId: data.clientId,
            });
            break;
        }
      };

      setWs(webSocket);

      return () => {
        webSocket.close();
      };
    };

    fetchData();
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({ type: "chat_message", message: inputMessage.trim() })
      );
      setInputMessage("");
    }
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const changeUsername = function () {};
  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Real-time Chat</h1>
        <div>
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "8px",
              backgroundColor: isConnected ? "green" : "red",
              color: "white",
            }}
          >
            {isConnected ? "Connected" : "Disconnected"}
          </span>

          {username && (
            <button onClick={changeUsername} style={{ marginLeft: "10px" }}>
              Change Username ({username})
            </button>
          )}
        </div>
      </div>
      <div
        style={{
          height: "400px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "10px",
          overflowY: "scroll",
          marginTop: "20px",
        }}
      >
        {messages.map((msg) =>
          msg.type === "system" ? (
            <div className="" key={msg.id} style={{ textAlign: "center" }}>
              {msg.message} — {formatTime(msg.timestamp)}
            </div>
          ) : (
            <div
              key={msg.id}
              style={{
                marginBottom: "8px",
                background: msg.isOwn ? "#e3f2fd" : "blue",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "6px 10px",
                alignSelf: msg.isOwn ? "flex-end" : "flex-start",
              }}
            >
              <strong>{msg.clientId == clientId ? "You" : msg.username}</strong>
              <p>{msg.message}</p>
              <small>{formatTime(msg.timestamp)}</small>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" style={{ marginLeft: "10px", padding: "8px" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
