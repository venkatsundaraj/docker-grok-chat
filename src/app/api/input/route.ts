import { db } from "@/server/db";
import { contactFormTable } from "@/server/db/schema";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { inputValue } = await req.json();
    console.log(inputValue);

    if (!inputValue) {
      throw new Error("Input Value REquired");
    }

    const result = await db
      .insert(contactFormTable)
      .values({ text: inputValue })
      .returning({ text: contactFormTable.text });
    console.log(result);

    return new Response(JSON.stringify(inputValue), { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
