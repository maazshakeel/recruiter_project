// Import necessary dependencies
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default function deleteProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Extract the product ID from the request query parameters
  const productId = req.query.id;
  console.log(req.query);

  // Check if the product ID is provided
  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  // Use the product ID to delete the corresponding record from the database
  db.run("DELETE FROM produk WHERE id = ?", [productId], (err) => {
    if (err) {
      console.error("Database Error:", err.message);
      return res.status(500).json({ error: "Failed to delete product" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  });
}
