"use client";
import {
  FilesetResolver,
  GestureRecognizer,
  type GestureRecognizerResult,
} from "@mediapipe/tasks-vision";
import { FC, useCallback, useEffect, useRef, useState } from "react";

interface GestureControllerProps {
  onThumbUp?: () => void;
  onThumbDown?: () => void;
  onOpenPalm?: () => void;
  onClosedFist?: () => void;
  onPointingUp?: () => void;
  onVictory?: () => void;
  onILoveYou?: () => void;
  onIdle?: () => void;
  onPinchClick?: () => void; // custom (from landmarks)
  onPointerMove?: (x: number, y: number) => void;
}

const GestureController: FC<GestureControllerProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let recognizer: GestureRecognizer | null = null;
    let raf = 0;
    let lastVideoTime = -1;

    const indexTipId = 8; // landmark indices per MediaPipe
    const thumbTipId = 4;
    // simple smoothing for pointer
    let smoothX = 0.5,
      smoothY = 0.5;

    const drawLandmarks = function (res: GestureRecognizerResult) {
      const ctx = canvasRef.current?.getContext("2d");
      const video = videoRef.current;

      if (!ctx || !video) return;

      canvasRef.current!.width = video.videoWidth;
      canvasRef.current!.height = video.videoHeight;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.lineWidth = 2;

      (res.landmarks ?? res.handednesses ?? []).forEach((points) => {
        // draw points
        ctx.beginPath();
        points.forEach((p) => {
          ctx.moveTo(p.x * ctx.canvas.width, p.y * ctx.canvas.height);
          ctx.arc(
            p.x * ctx.canvas.width,
            p.y * ctx.canvas.height,
            3,
            0,
            Math.PI * 2
          );
        });
        ctx.stroke();
      });
    };

    const distance = (
      a: { x: number; y: number },
      b: { x: number; y: number }
    ) => {
      const dx = a.x - b.x,
        dy = a.y - b.y;
      return Math.hypot(dx, dy);
    };

    const actOnResults = function (res: GestureRecognizerResult) {
      const gestureForHands = res.gestures ?? [];
      if (gestureForHands.length > 0 && gestureForHands[0].length > 0) {
        const top = gestureForHands[0][0];
        console.log(top.categoryName);
        switch (top.categoryName) {
          case "Thumb_Up":
            // console.log("Thumb_Up");
            props.onThumbUp?.();
            break;
          case "Thumb_Down":
            // console.log("Thumb_Down");
            props.onThumbDown?.();
            break;
          case "Open_Palm":
            console.log("Open_Palm");
            props.onOpenPalm?.();
            break;
          case "Closed_Fist":
            props.onClosedFist?.();
            break;
          case "Pointing_Up":
            props.onPointingUp?.();
            break;
          case "Victory":
            props.onVictory?.();
            break;
          case "ILoveYou":
            props.onILoveYou?.();
            break;
        }
      }

      const hands = res.landmarks ?? res.handedness ?? [];

      if (hands.length > 0) {
        const pts = hands[0];
        const idx = pts[indexTipId];
        const thumb = pts[thumbTipId];

        // Pointer position (normalized 0..1) with light smoothing
        const targetX = idx.x,
          targetY = idx.y;
        const alpha = 0.35;
        smoothX = smoothX + alpha * (targetX - smoothX);
        smoothY = smoothY + alpha * (targetY - smoothY);
        props.onPointerMove?.(smoothX, smoothY);

        // Normalize pinch by hand size (wrist(0) to middle_mcp(9))
        const wrist = pts[0],
          middleMcp = pts[9];
        const handScale = Math.max(0.001, distance(wrist, middleMcp));
        const pinch = distance(idx, thumb) / handScale;
        if (pinch < 0.35) props.onPinchClick?.(); // tweak threshold as needed
      }
    };

    const frame = () => {
      const video = videoRef.current!;
      if (!recognizer || !video) return;
      const now = performance.now();

      if (video.currentTime !== lastVideoTime) {
        const result = recognizer.recognizeForVideo(video, now);
        drawLandmarks(result);
        actOnResults(result);

        lastVideoTime = video.currentTime;
      }
      raf = requestAnimationFrame(frame);
    };

    (async () => {
      // 1) open camera (works on https or localhost)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1200, height: 600 },
      });
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      // 2) load wasm & model, create recognizer in VIDEO mode
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      // console.log(vision);
      recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        },
        runningMode: "VIDEO",
        numHands: 2,
        cannedGesturesClassifierOptions: {
          // example: only keep a few gestures
          categoryAllowlist: [
            "Open_Palm",
            "Closed_Fist",
            "Thumb_Up",
            "Thumb_Down",
          ],
        },
      });

      raf = requestAnimationFrame(frame);
    })();

    return () => {
      cancelAnimationFrame(raf);
      recognizer?.close();
      recognizer = null;
      // stop camera
      const tracks =
        (videoRef.current?.srcObject as MediaStream | null)?.getTracks() || [];
      tracks.forEach((t) => t.stop());
    };
  }, [props]);

  return (
    <section className="w-full h-full items-center justify-center  relative hidden">
      <video
        ref={videoRef}
        className="w-full max-w-2xl rounded-lg "
        playsInline
        autoPlay
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 max-w-2xl mx-auto pointer-events-none"
        style={{
          width: videoRef.current?.offsetWidth || "auto",
          height: videoRef.current?.offsetHeight || "auto",
        }}
      />
    </section>
  );
};

export default GestureController;

// const initializeCamera = useCallback(async () => {
//   try {
//     setIsLoading(true);
//     setError("");

//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: {
//         width: { ideal: 600 },
//         height: { ideal: 480 },
//         facingMode: "user",
//       },
//     });

//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//       await videoRef.current.play();
//     }
//     setIsLoading(false);
//   } catch (err) {
//     setError("Failed to access camera. Please grant camera permissions.");
//     setIsLoading(false);
//     console.error("Camera initialization error:", err);
//   }
// }, []);

// const drawVideoToCanvas = useCallback(async () => {
//   const video = videoRef.current;
//   const canvas = canvasRef.current;

//   if (!video || !canvas || video.readyState !== 4) return;

//   const ctx = canvas.getContext("2d");
//   if (!ctx) return;

//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;

//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
// }, []);
