"use client";
import { FC } from "react";
import GestureController from "@/app/_components/gestures/GestureController";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <main className="w-screen min-h-screen flex items-center justify-center">
      <GestureController
      // onThumbUp={() => console.log("Thumbs UP")}
      // onThumbDown={() => console.log("Thumbs Down")}
      />
    </main>
  );
};

export default page;
