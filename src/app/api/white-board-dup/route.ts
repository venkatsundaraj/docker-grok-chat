import { createServer } from "http";
import { NextRequest, NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";

const globalForSocket = globalThis as unknown as {
  createServer: any;
  io: SocketIOServer | undefined;
};

export async function GET(req: NextRequest) {
  try {
    if (!globalForSocket.io) {
      console.log(true);
      const server = createServer();
      const io = new SocketIOServer({
        cors: {
          origin: "*",
          methods: ["GET", "POST"],
        },
        path: "/api/white-board-dup",
      });

      globalForSocket.createServer = server;
      globalForSocket.io = io;

      io.on("connection", () => {
        console.log("connected");
      });

      server.listen(3001, () => {
        console.log("server is running at 3001");
      });
    }
    return NextResponse.json({ res: "success" }, { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
