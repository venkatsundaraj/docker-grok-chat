"use client";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const animationRef = useRef<number>(0);

  //initiate drawing
  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      console.log(true);
      const canvas = canvasRef.current;

      const data = canvas?.getBoundingClientRect();
      const x = e.clientX - (data?.left || 0);
      const y = e.clientY - (data?.top || 0);
      //   console.log(x, y, e.clientX, e.clientY, data);
      const ctx = canvas?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    },
    [isDrawing]
  );

  //start drawing
  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      const x = e.clientX - (rect?.left || 0);
      const y = e.clientY - (rect?.top || 0);

      console.log("Drawing to:", { x, y });
    },
    [isDrawing]
  );

  return (
    <main className="flex items-center justify-center">
      <div className="container flex-col flex items-center relative justify-center">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair w-full h-screen z-10 bg-green-400"
          onMouseDown={(e) => startDrawing(e)}
          //   onMouseLeave={stopDrawing}
          //   onMouseUp={stopDrawing}
          onMouseMove={(e) => draw(e)}
        />
      </div>
    </main>
  );
};

export default page;
