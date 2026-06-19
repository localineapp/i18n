/* eslint-disable @typescript-eslint/no-explicit-any */
import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";

const LOCALE_EXTENSIONS = [".json"];

function sortObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = sortObject(obj[key]);
        return acc;
      }, {} as any);
  }

  return obj;
}

function isLocaleFile(filename: string) {
  return LOCALE_EXTENSIONS.some(ext => filename.endsWith(ext));
}

function sortLocaleFilesInRoot() {
  const root = process.cwd();
  const files = readdirSync(root);

  for (const file of files) {
    const fullPath = join(root, file);
    const stat = statSync(fullPath);

    if (stat.isFile() && isLocaleFile(file)) {
      const raw = readFileSync(fullPath, "utf8");
      const json = JSON.parse(raw);

      const sorted = sortObject(json);
      writeFileSync(fullPath, JSON.stringify(sorted, null, 2) + "\n");

      console.log(`Sorted: ${file}`);
    }
  }
}

sortLocaleFilesInRoot();
