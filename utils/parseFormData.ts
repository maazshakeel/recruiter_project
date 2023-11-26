import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File } from "formidable";
import Product from "@/types/custom";

type ProcessedFiles = Array<[string, File]>;

export const parseFormData = async (
  req: NextApiRequest,
  inputData: Product | any,
) => {
  return new Promise<ProcessedFiles | undefined>((resolve, reject) => {
    const form = new IncomingForm();

    const files: ProcessedFiles = [];
    form.on("field", function (field, value) {
      inputData[field] = value;
    });
    form.on("file", function (field, file) {
      files.push([field, file]);
    });
    form.on("end", () => resolve(files));
    form.on("error", (err) => reject(err));
    form.parse(req);
  });
};
