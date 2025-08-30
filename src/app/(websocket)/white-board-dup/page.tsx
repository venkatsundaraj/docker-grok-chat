"use client";
import { FC, useEffect } from "react";
import { io } from "socket.io-client";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  useEffect(() => {
    const init = async function () {
      const val = await fetch("/api/white-board-dup");
      console.log(val);
      const ioClient = io("http://localhost:3001", {
        transports: ["websocket"],
        path: "/api/white-board-dup",
      });
      console.log(ioClient);

      ioClient.on("connected", () => {
        console.log("connected");
      });
    };
    init();
  }, []);
  return <div>page</div>;
};

export default page;
