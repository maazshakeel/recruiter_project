import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function readProduct(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    db.serialize(() => {
      db.all("SELECT * FROM produk", (err, rows) => {
        db.all("SELECT * FROM suplier", (d, s) => {
          if (err) {
            console.error(err.message);
            return res
              .status(500)
              .json({ error: "Failed to retrieve products" });
          }
          return res.status(200).json([rows, s]);
        });
      });
    });
  } else {
    return res.status(404).json({ status: "Wrong method!" });
  }
}
