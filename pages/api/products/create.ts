import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Product } from "@/types/custom";
import { moveFile } from "@/utils/moveFile";
import { createDirectory } from "@/utils/createDirectory";
import { parseFormData } from "@/utils/parseFormData";
import { getLastProductId, insertProduct } from "@/services/crud.service";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let status = 200;
  const inputData: Product | any = {};

  const lastProductId = await getLastProductId();
  const newProductId = lastProductId !== null ? lastProductId + 1 : 1;

  try {
    const files = await parseFormData(req, inputData);

    if (files?.length) {
      const targetPath = path.join(process.cwd(), `public/uploads/products/`);
      const n = `${newProductId.toString()}.${files[0][1]?.originalFilename?.split(
        "."
      )[1]}`;
      await createDirectory(targetPath);

      for (const file of files) {
        const tempPath = file[1].filepath;
        if (!file[1].originalFilename) {
          return res.status(400).send("Error: Original filename missing.");
        }

        const targetFilePath = path.join(targetPath, n);

        await moveFile(tempPath, targetFilePath);
      }

      const file_user = `uploads/products/${newProductId.toString()}.${files[0][1]?.originalFilename?.split(
        "."
      )[1]}`;
      inputData["path"] = file_user;

      await insertProduct(inputData);

      return res.status(201).json({ message: "Product created successfully" });
    } else {
      return res.status(404).send("Upload file.");
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    status = 500;
    return res.status(status).json({ error: "Internal Server Error" });
  }
};

export default handler;
