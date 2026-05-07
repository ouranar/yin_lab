import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthorizedRequest } from "@/lib/auth";
import { PUBLIC_UPLOADS_DIR } from "@/lib/site-data";

const sanitize = (value: string) => value.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/-+/g, "-");

export async function POST(request: NextRequest) {
  if (!isAuthorizedRequest(request)) {
    return NextResponse.json(
      {
        ok: false,
        message: "未授权",
      },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = `${formData.get("folder") ?? "common"}`.trim() || "common";

  if (!(file instanceof File)) {
    return NextResponse.json(
      {
        ok: false,
        message: "未选择文件",
      },
      { status: 400 },
    );
  }

  const extension = path.extname(file.name) || ".bin";
  const baseName = path.basename(file.name, extension);
  const stamp = Date.now();
  const targetFolder = path.join(PUBLIC_UPLOADS_DIR, sanitize(folder));
  const targetName = `${sanitize(baseName)}-${stamp}${extension}`;
  const targetPath = path.join(targetFolder, targetName);

  await mkdir(targetFolder, { recursive: true });
  await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    ok: true,
    path: `/uploads/${sanitize(folder)}/${targetName}`,
  });
}
