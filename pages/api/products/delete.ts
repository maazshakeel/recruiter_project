// Import necessary dependencies
import db from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function deleteProduct(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "DELETE") {
    const productId = req.query.id;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    // Retrieve image path from the database before deleting the product
    db.get(
      "SELECT foto FROM produk WHERE id = ?",
      [productId],
      async (err, row: any) => {
        if (err) {
          console.error("Database Error:", err.message);
          return res.status(500).json({ error: "Failed to delete product" });
        }

        if (!row || !row.foto) {
          return res.status(404).json({ error: "Product not found" });
        }

        const imagePath = row.foto;

        // Delete the product from the database
        db.run("DELETE FROM produk WHERE id = ?", [productId], async (err) => {
          if (err) {
            console.error("Database Error:", err.message);
            return res.status(500).json({ error: "Failed to delete product" });
          }

          // Delete the associated image
          console.log(imagePath);
          const fullPath = path.join(process.cwd(), `public/${imagePath}`);
          try {
            await fs.unlink(fullPath);
            return res
              .status(200)
              .json({ message: "Product and image deleted successfully" });
          } catch (error) {
            console.error("Error deleting image:", error.message);
            return res.status(500).json({ error: "Failed to delete image" });
          }
        });
      },
    );
  } else {
    return res.status(404).json({ status: "Wrong method!" });
  }
}
