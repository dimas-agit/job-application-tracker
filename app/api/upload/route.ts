import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request:NextRequest){
    try{
        const formData = await request.formData();

        const files = formData.getAll("files") as File[];

        if(!files.length){
            return NextResponse.json(
                {error:"No files uploaded"},
                {status: 400}
            );
        }

        const uploadDir = path.join(process.cwd(),"public","uploads");
        await mkdir(uploadDir,{recursive:true})

        const urls:string[] = [];

        for(const file of files){
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const extension = path.extname(file.name);
            const fileName = `${crypto.randomUUID()}${extension}`;
            const filePath = path.join(uploadDir,fileName);
            
            await writeFile(filePath,buffer);

            urls.push(`/uploads/${fileName}`);
        }

        return NextResponse.json(
            {urls}
        );
    }catch(err){
    console.error(err);

        return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
        );
    }
}