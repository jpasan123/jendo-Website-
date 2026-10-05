import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

/** Slips live outside `public/` and are only served through the admin-only API route. */
function uploadDir() {
  return process.env.BOOKING_UPLOAD_DIR?.trim() || path.join(process.cwd(), "data", "booking-slips");
}

export async function saveSlip(bytes: Uint8Array, ext: string): Promise<string> {
  const dir = uploadDir();
  await mkdir(dir, { recursive: true, mode: 0o750 });
  const file = `${randomUUID()}.${ext}`;
  await writeFile(path.join(dir, file), bytes, { mode: 0o640 });
  return file;
}

function safePath(file: string) {
  // stored names are generated here (uuid.ext); anything else is rejected
  if (!/^[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/.test(file)) throw new Error("Invalid slip file name");
  return path.join(uploadDir(), file);
}

export async function readSlip(file: string): Promise<Buffer> {
  return readFile(safePath(file));
}

export async function deleteSlip(file: string): Promise<void> {
  try {
    await unlink(safePath(file));
  } catch {
    /* already gone */
  }
}
