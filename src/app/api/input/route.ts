import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { inputValue } = await req.json();

    if (!inputValue) {
      throw new Error("Input Value REquired");
    }

    const res = Number(inputValue) * 2;

    return new Response(JSON.stringify(res), { status: 200 });
  } catch (err) {
    console.log(err);
  }
}
