"use client";
import { FC, useState } from "react";
import React from "react";

interface pageProps {}

const page: FC<pageProps> = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const onSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("/api/input", {
        body: JSON.stringify({ inputValue }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = async function (
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setInputValue(e.currentTarget.value);
  };
  return (
    <form onSubmit={onSubmit} className="flex gap-3">
      <input
        onChange={handleInputChange}
        type="number"
        className="border border-white rounded-sm p-2"
        placeholder="Type your message..."
      />
      <button className="px-4 py-2 border border-white rounded-sm">
        submit
      </button>
    </form>
  );
};

export default page;
