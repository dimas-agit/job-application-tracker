import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const files = formData.getAll("files") as File[];

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      const extension = file.name.includes(".")
        ? "." + file.name.split(".").pop()
        : "";

      const fileName = `${crypto.randomUUID()}${extension}`;

      const blob = await put(
        `uploads/${fileName}`,
        file,
        {
          access: "public",
        }
      );

      urls.push(blob.url);
    }

    return NextResponse.json({
      urls,
    });
  } catch (err) {
    console.error("Upload error:", err);

    return NextResponse.json(
      {
        error: "Failed to upload files",
      },
      {
        status: 500,
      }
    );
  }
}