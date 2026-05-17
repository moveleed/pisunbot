import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "data.json");

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}), "utf-8");
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function saveDB(data) {
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, DB_FILE);
}

export function getUser(userId) {
  return loadDB()[String(userId)] ?? null;
}

export function setUser(userId, userData) {
  const db = loadDB();
  db[String(userId)] = userData;
  saveDB(db);
}

export function updateUser(userId, fields) {
  const db = loadDB();
  const uid = String(userId);
  db[uid] = { ...(db[uid] ?? {}), ...fields };
  saveDB(db);
}