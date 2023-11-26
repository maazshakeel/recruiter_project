import db from "@/lib/db";
import { Product } from "@/types/custom";

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
    ]
  );
};

export const updateProduct = async (
  productId: number,
  inputData: Product | any
) => {
  db.run(
    "UPDATE produk SET nama = ?, deskripsi = ?, harga = ?, stok = ?, foto = ?, suplier_id = ? WHERE id = ?",
    [
      inputData.nama,
      inputData.deskripsi,
      inputData.harga,
      inputData.stok,
      inputData.path,
      inputData.suplier_id,
      productId,
    ]
  );
};

export const getProductById = async (productId: number) => {
  db.serialize(() => {
    const product = db.get("SELECT * FROM produk WHERE id = 1");
    return product;
  });
  // const product = db.get("SELECT * FROM produk WHERE id = 1");
};
