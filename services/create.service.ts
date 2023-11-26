import db from "@/lib/db";
import Product from "@/types/custom";

export async function getLastProductId() {
  return new Promise<number>((resolve, reject) => {
    db.get("SELECT MAX(id) as maxId FROM produk", (err, row: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.maxId : null);
      }
    });
  });
}
export const insertProduct = async (inputData: Product | any) => {
  db.run(
    "INSERT INTO produk (nama, deskripsi, harga, stok, foto, suplier_id) VALUES (?, ?, ?, ?, ?, ?)",
    [
      inputData.nama,
      inputData.deskripsi,
      inputData.harga,
      inputData.stok,
      inputData.path,
      inputData.suplier_id,
    ],
  );
};
