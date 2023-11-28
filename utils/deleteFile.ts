import { promises as fs } from "fs";

export const deleteFile = async (fullPath: string) => {
  console.log(fullPath);
  try {
    await fs.unlink(fullPath.toString());
  } catch (error: any) {
    console.error("Error deleting image:", error.message);
  }
};
