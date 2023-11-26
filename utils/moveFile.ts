import { promises as fs } from "fs";

export const moveFile = async (sourcePath: string, targetPath: string) => {
  await fs.copyFile(sourcePath, targetPath);
  await fs.unlink(sourcePath);
};
