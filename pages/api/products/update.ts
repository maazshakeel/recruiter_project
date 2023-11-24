import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Handler for the Create operation
export default function updateProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  return res.status(200).json({ satus: "ok" });
}
