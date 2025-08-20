import { NextRequest, NextResponse } from "next/server";
import { WebSocket, WebSocketServer } from "ws";
import { v4 as uuidv4 } from "uuid";

type ClientInfo = {
  id: string;
  ws: WebSocket;
  userName: String;
};

const globalAny = global as any;

if (!globalAny.wss) {
  console.log("Starting WebSocket server...");
  const wss = new WebSocketServer({ port: 3001 });
  const clients = new Map<string, ClientInfo>();

  wss.on("connection", (ws: WebSocket) => {
    const clientId = uuidv4();

    const clientInfo: ClientInfo = {
      id: clientId,
      ws,
      userName: `Users-${Math.floor(Math.random() * 1000)}`,
    };

    clients.set(clientId, clientInfo);

    // console.log(clients);
    console.log(`Client ${clientId} connected. Total: ${clients.size}`);

    ws.send(
      JSON.stringify({
        type: "welcome",
        message: `Welcome! You are ${clientInfo.userName}`,
        clientId,
        userName: clientInfo.userName,
      })
    );

    broadCast(
      {
        type: "user_joined",
        message: `${clientInfo.userName} joined the chat`,
        timestamp: new Date().toISOString(),
      },
      clientId
    );

    ws.on("message", (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "chat_message": {
            broadCast(
              {
                type: "chat_message",
                userName: clientInfo.userName,
                message: message.message,
                timestamp: new Date().toISOString(),
                clientId,
              },
              clientId
            );
            break;
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    ws.on("close", () => {
      clients.delete(clientId);
      console.log(`Client ${clientId} disconnected. Total: ${clients.size}`);
      broadCast(
        {
          type: "user_left",
          message: `${clientInfo.userName} left the chat`,
          timestamp: new Date().toISOString(),
        },
        clientId
      );
    });

    function broadCast(message: object, excludeId: string | null) {
      const msgStr = JSON.stringify(message);
      console.log(msgStr);
      clients.forEach((client, clientId) => {
        if (clientId !== excludeId && client.ws.readyState === WebSocket.OPEN) {
          // if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(msgStr);
        }
      });
    }
  });

  globalAny.wss = wss;
}

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json(
      { message: "WebSocket server running on port 3001" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
