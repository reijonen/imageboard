import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const fileName = url.searchParams.get("file");
	if (!fileName)
		return NextResponse.json({ error: "File name missing" }, { status: 400 });

	try {
		const filePath = path.join(process.cwd(), "public", fileName);
		const file = fs.readFileSync(filePath);
		return new NextResponse(file, { status: 200, headers: { "Content-Type": "image/*" } });
	} catch (e) {
		return NextResponse.json({ error: "File not found" }, { status: 404 });
	}
}
