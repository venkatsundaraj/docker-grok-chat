import Image from "next/image";
import dynamic from "next/dynamic";
import ChatBody from "@/app/_components/chat-body";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-white ">
      <ChatBody />
    </main>
  );
}
