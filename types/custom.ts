import { NextApiRequest } from "next";

// Create a type for product
interface Product {
  id?: number;
  nama: string;
  deskripsi: string;
  harga: number;
  stok: number;
  foto: string;
  suplier_id: number;
}

interface CustomNextApiRequest extends NextApiRequest {
  query: {
    id: string;
  };
}

export type { Product, CustomNextApiRequest };
