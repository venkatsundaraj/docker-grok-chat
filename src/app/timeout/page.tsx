"use client";

import { FC, useEffect, useRef, useState } from "react";

interface Props {}

const page: FC<Props> = () => {
  const [value, setValue] = useState<number>(0);
  const timeOut = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    return () => {
      if (timeOut.current) clearInterval(timeOut.current);
    };
  });

  const actionHandler = function (action: "start" | "pause" | "reset") {
    if (action === "start") {
      if (timeOut.current) return;
      timeOut.current = setInterval(() => {
        setValue((prev) => prev + 1);
      }, 1000);
    } else if (action === "pause") {
      console.log(timeOut.current, "before");
      if (timeOut.current) {
        clearInterval(timeOut.current);
        timeOut.current = null;
      }
      console.log(timeOut.current, "after");
    } else if (action === "reset") {
      if (timeOut.current) {
        clearInterval(timeOut.current);
      }

      setValue((value) => (value = 0));
    }
  };

  return (
    <section className="w-screen h-screen bg-amber-700 flex gap-2  flex-col items-center justify-center">
      <span className="text-5xl">{value}</span>
      <button onClick={() => actionHandler("start")}>start</button>
      <button onClick={() => actionHandler("pause")}>pause</button>
      <button onClick={() => actionHandler("reset")}>reset</button>
    </section>
  );
};

export default page;
