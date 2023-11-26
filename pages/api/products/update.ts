import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function updateProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const productId = req.query.id;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const { nama, deskripsi, harga, stok, foto, suplier_id } = req.body;

    db.run(
      "UPDATE produk SET nama = ?, deskripsi = ?, harga = ?, stok = ?, foto = ?, suplier_id = ? WHERE id = ?",
      [nama, deskripsi, harga, stok, foto, suplier_id, productId],
      (err) => {
        if (err) {
          console.error("Database Error:", err.message);
          return res.status(500).json({ error: "Failed to update product" });
        }

        return res
          .status(200)
          .json({ message: "Product updated successfully" });
      },
    );
  } else {
    return res.status(404).json({ status: "Wrong method!" });
  }
}
