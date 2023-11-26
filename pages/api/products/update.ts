import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function updateProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Extract the product ID from the request query parameters
  const productId = req.query.id;

  // Check if the product ID is provided
  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  // Extract the updated product data from the request body
  const { nama, deskripsi, harga, stok, foto, suplier_id } = req.body;

  // Use the product ID to update the corresponding record in the database
  db.run(
    "UPDATE produk SET nama = ?, deskripsi = ?, harga = ?, stok = ?, foto = ?, suplier_id = ? WHERE id = ?",
    [nama, deskripsi, harga, stok, foto, suplier_id, productId],
    (err) => {
      if (err) {
        console.error("Database Error:", err.message);
        return res.status(500).json({ error: "Failed to update product" });
      }

      return res.status(200).json({ message: "Product updated successfully" });
    },
  );
}
