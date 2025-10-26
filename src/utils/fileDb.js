import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data.json");

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch (err) {
    const empty = { users: [], products: [], slots: [], transactions: [] };
    await fs.writeFile(filePath, JSON.stringify(empty, null, 2), "utf8");
  }
}

export async function readData() {
  await ensureFile();
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function writeData(data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export async function getNextId(collectionName) {
  const data = await readData();
  const arr = data[collectionName] || [];
  if (!arr.length) return 1;
  return Math.max(...arr.map((x) => x.id || 0)) + 1;
}
