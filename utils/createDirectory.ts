import { promises as fs } from "fs";

export const createDirectory = async (targetPath: string) => {
  try {
    await fs.access(targetPath);
  } catch (e) {
    await fs.mkdir(targetPath);
  }
};
