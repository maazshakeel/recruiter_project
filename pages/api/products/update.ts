import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { CustomNextApiRequest, Product } from "@/types/custom";
import { moveFile } from "@/utils/moveFile";
import { createDirectory } from "@/utils/createDirectory";
import { parseFormData } from "@/utils/parseFormData";
import { updateProduct } from "@/services/crud.service";
import db from "@/lib/db";
import { deleteFile } from "@/utils/deleteFile";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: CustomNextApiRequest, res: NextApiResponse) => {
  let status = 200;
  const inputData: Product | any = {};

  let d;
  db.get(
    "SELECT * FROM produk WHERE id = ?",
    [req.query.id],
    async (err, rows) => {
      if (rows === undefined) {
        return res.status(404).send("NOt found!");
      }

      try {
        const files = await parseFormData(req, inputData);
        console.log(path.join(process.cwd(), `public/${rows.foto}`));
        console.log(
          "=================================== DELETE EXISTING FILE ================================="
        );
        deleteFile(path.join(process.cwd(), `public/${rows.foto}`));
        console.log(
          "=================================== DELETE EXISTING FILE ================================="
        );

        if (files?.length) {
          const targetPath = path.join(
            process.cwd(),
            `public/uploads/products/`
          );
          const n = `${req.query.id}.${files[0][1]?.originalFilename?.split(
            "."
          )[1]}`;
          console.log(n);
          await createDirectory(targetPath);

          for (const file of files) {
            const tempPath = file[1].filepath;
            if (!file[1].originalFilename) {
              return res.status(400).send("Error: Original filename missing.");
            }

            const targetFilePath = path.join(targetPath, n);
            console.log(targetFilePath);

            await moveFile(tempPath, targetFilePath);
          }

          const file_user = `uploads/products/${
            req.query.id
          }.${files[0][1]?.originalFilename?.split(".")[1]}`;
          inputData["path"] = file_user;

          await updateProduct(parseInt(req.query.id), inputData);

          return res
            .status(201)
            .json({ message: "Product updated successfully" });
        } else {
          return res.status(404).send("Upload file.");
        }
      } catch (error: any) {
        console.error("Error:", error.message);
        status = 500;
        return res.status(status).json({ error: "Internal Server Error" });
      }
    }
  );
};

export default handler;
