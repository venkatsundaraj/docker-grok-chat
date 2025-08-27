"use server";

import { DataSchema } from "@/app/(convex)/controller-rhf/page";

export async function submitData(data: DataSchema) {
  console.log(data);
}
