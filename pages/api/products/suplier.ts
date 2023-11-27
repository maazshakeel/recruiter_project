import db from "@/lib/db";
import { insertSuplier } from "@/services/crud.service";
import { NextApiRequest, NextApiResponse } from "next";

export default function createSuplier(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    insertSuplier(req.body);

    return res.status(201).json({ message: "Suplier created successfully" });
  } else {
    return res.status(404).json({ status: "Wrong method!" });
  }
}
