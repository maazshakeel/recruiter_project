import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

// Handler for the Create operation
export default function readProduct(req: NextApiRequest, res: NextApiResponse) {
  db.serialize(() => {
    // Select all products from the 'produk' table
    db.all("SELECT * FROM produk", (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Failed to retrieve products" });
      }

      return res.status(200).json({ status: "ok", rows });
    });
  });
}
