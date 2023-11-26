import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function createProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { nama, deskripsi, harga, stok, foto, suplier_id } = req.body;

  db.run(
    "INSERT INTO produk (nama, deskripsi, harga, stok, foto, suplier_id) VALUES (?, ?, ?, ?, ?, ?)",
    [nama, deskripsi, harga, stok, foto, suplier_id],
    (err) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Failed to create product" });
      }

      return res.status(201).json({ message: "Product created successfully" });
    },
  );
}
