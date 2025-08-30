"use client";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

import { io, Socket } from "socket.io-client";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [isConnected, setIsConnected] = useState(false);
  // const [userCount, setUserCount] = useState(0);
  // const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  // const videoRef = useRef<HTMLVideoElement | null>(null);
  // const animationRef = useRef<number>(0);

  useEffect(() => {
    const initSocket = async function () {
      try {
        const res = await fetch("/api/canvas");

        console.log("Server init response:", await res.json());

        const newSocket = io("http://localhost:3001", {
          path: "/api/canvas",
          transports: ["websocket"],
        });

        newSocket.on("hello", (data) => console.log(data));

        newSocket.on("connect", () => {
          console.log("Connected to server:", newSocket.id);
          console.log(newSocket);
          setConnectionStatus("connected");
          setIsConnected(true);
        });
        newSocket.on("disconnect", () => {
          console.log("Disconnected from server");
          setIsConnected(false);

          setConnectionStatus("Disconnected");
        });

        newSocket.on("connect_error", (error) => {
          console.error("Connection error:", error);
          setConnectionStatus("Connection Error");
        });

        // newSocket.on("user_count", (count: number) => {
        //   setUserCount(count);
        // });

        newSocket.on("drawing_start", (data) => {
          console.log("Received drawing_start:", data);
          const canvas = canvasRef.current;

          if (!canvas) return;

          if (canvas) {
            const ctx = canvas.getContext("2d");

            if (ctx) {
              ctx.beginPath();
              ctx.moveTo(data.x, data.y);
            }
          }
        });

        newSocket.on("drawing_move", (data) => {
          drawOnCanvas(data.x, data.y);
        });

        newSocket.on("drawing_end", () => {
          const canvas = canvasRef.current;

          if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.beginPath();
            }
          }
        });

        setSocket(newSocket);
      } catch (err) {
        console.log(err);
      }
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // ---------------------------------------------------------------------

  //initiate drawing
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    // if (!isConnected || !socket) return;
    // console.log(isConnected, socket);
    setIsDrawing(true);
    const canvas = canvasRef.current;

    const data = canvas?.getBoundingClientRect();
    // console.log(data);
    const x = e.clientX - (data?.left || 0);
    const y = e.clientY - (data?.top || 0);

    console.log(x, y, e.clientX, e.clientY, data);
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    socket?.emit("drawing_start", {
      x,
      y,
    });
  }, []);

  // ---------------------------------------------------------------------

  //start drawing
  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      console.log("Drawing to:", { x, y });

      drawOnCanvas(x, y);
      socket?.emit("drawing_move", {
        x,
        y,
      });
    },
    [isDrawing]
  );

  // ---------------------------------------------------------------------

  const drawOnCanvas = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    console.log(x, y);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  // ---------------------------------------------------------------------

  const stopDrawing = useCallback(
    function () {
      if (!isDrawing) return;
      setIsDrawing(false);
      socket?.emit("drawing_end", { timeStamp: Date.now() });

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.beginPath();
        }
      }
    },
    [isDrawing, isConnected, socket]
  );

  return (
    <main className="flex items-center justify-center">
      <div className="container flex-col flex items-center relative justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={800}
          className="cursor-crosshair  bg-green-500"
          onMouseDown={(e) => startDrawing(e)}
          onMouseLeave={stopDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={(e) => draw(e)}
        />
      </div>
    </main>
  );
};

export default page;
