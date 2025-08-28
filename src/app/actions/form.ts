"use server";

import { DataSchema } from "@/app/(convex)/controller-rhf/page";
import { openai } from "@ai-sdk/openai";

export async function submitData(data: DataSchema) {
  console.log(data);
}

// export async function generateImage(prompt:string):Promise<string>{
//   try{
//     const response = await openai.images
//   }
// }
