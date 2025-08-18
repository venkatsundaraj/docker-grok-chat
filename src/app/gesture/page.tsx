"use client";
import { FC, useEffect, useRef, useState } from "react";
import GestureController from "@/app/_components/gestures/GestureController";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const [gesture, setGesture] = useState<"up" | "down" | null>(null);

  // Start continuous scroll
  const startScrolling = (direction: "up" | "down") => {
    // Prevent multiple intervals
    if (scrollInterval.current) return;

    scrollInterval.current = setInterval(() => {
      window.scrollBy({
        top: direction === "up" ? -40 : 40, // scroll speed
        behavior: "smooth", // 'smooth' feels laggy for continuous scroll
      });
    }, 30); // interval in ms
  };

  // Stop continuous scroll
  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  // Effect: whenever gesture changes
  useEffect(() => {
    if (gesture === "up") {
      startScrolling("up");
    } else if (gesture === "down") {
      startScrolling("down");
    } else {
      stopScrolling();
    }

    return () => stopScrolling();
  }, [gesture]);
  return (
    <main className="w-screen min-h-screen flex flex-col items-center justify-center">
      <GestureController
        onThumbUp={() => setGesture("down")}
        onThumbDown={() => setGesture("up")}
        onClosedFist={() => setGesture(null)} //
      />
      <section className="w-screen h-screen bg-amber-700 flex gap-2  flex-col items-center justify-center">
        <div className="border shadow-lg backdrop-blur-2xl flex gap-2  flex-col items-center justify-center p-8 rounded-md">
          <h1 className="text-5xl text-white font-normal">
            Thumbs Up - Scroll Down
          </h1>
          <h1 className="text-5xl text-white font-normal">
            Thumbs Down - Scroll Up
          </h1>
          <h1 className="text-5xl text-white font-normal">
            Close Fist - Pause
          </h1>
        </div>
      </section>
      <section className="w-screen h-screen bg-slate-600" />
      <section className="w-screen h-screen bg-blue-700" />
    </main>
  );
};

export default page;
