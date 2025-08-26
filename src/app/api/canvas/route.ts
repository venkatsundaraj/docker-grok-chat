import { NextRequest, NextResponse } from "next/server";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

const globalForSocket = globalThis as unknown as {
  httpServer: any;
  io: SocketIOServer | undefined;
};

export async function GET() {
  if (!globalForSocket.io) {
    console.log("Initializing the socket.io server");

    const httpServer = createServer();

    const io = new SocketIOServer(httpServer, {
      path: "/api/canvas",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    globalForSocket.io = io;
    globalForSocket.httpServer = httpServer;

    io.on("connection", (socket) => {
      console.log("Client connected", io.engine.clientsCount);

      //   console.log(socket);

      socket.on("hello", () => {
        console.log("hello world");
        return "Hello world";
      });

      socket.on("drawing_start", (data) => {
        console.log("Drawing start", data);
        socket.broadcast.emit({
          ...data,
          userId: socket.id,
        });
      });

      //   socket.emit("user_count", io.engine.clientsCount);

      socket.on("drawing_move", (data) => {
        socket.broadcast.emit("drawing_move", {
          ...data,
          userId: socket.id,
        });
      });

      socket.on("drawing_end", (data) => {
        socket.broadcast.emit("drawing_end", {
          ...data,
          userId: socket.id,
        });
      });

      //   socket.on("clear_canvas", () => {
      //     io.emit("clear_canvas");
      //   });

      //   socket.on("disconnect", () => {
      //     console.log(`Client disconnected: ${socket.id}`);
      //     io.emit("user_count", io.engine.clientsCount);
      //   });
    });

    httpServer.listen(3001, () => {
      console.log("Server.io is running port number 3001");
    });
  }

  return NextResponse.json({
    message: "Socket.io server is initialized",
    success: true,
  });
}
