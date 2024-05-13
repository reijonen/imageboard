import { NextRequest, NextResponse } from "next/server";
import fs from "fs"
import { pipeline } from "stream";
import { promisify } from "util";
import { zfd } from "zod-form-data";
import { fileTypeFromFile } from 'file-type';
import getConfig from "next/config";

import db from "../../db"

import { AttachmentType } from "@/types.d";

const { serverRuntimeConfig } = getConfig()
const { mediaPath } = serverRuntimeConfig

const pump = promisify(pipeline)
const schema = zfd.formData({
	file: zfd.file(),
	board: zfd.text(),
	content: zfd.text(),
});

import crypto from "crypto"
function hashFile(path: string) {
	const sum = crypto.createHash("sha256");
	sum.update(fs.readFileSync(path));
	return sum.digest("hex")
}

function parseMimeType(mimeType: string): AttachmentType | null {
	const firstPart = mimeType.split("/")[0]

	switch (firstPart) {
		case 'image':
			return AttachmentType.Image;
		case 'video':
			return AttachmentType.Video;
		case 'audio':
			return AttachmentType.Audio;
		default:
			return null;
	}
}

// TODO: samaan endpoittiin tulee myös vastaukset joten myös niitä pitää tukea (parenting ja konditionaalinen attachment vaatimus)
export async function POST(req: NextRequest) {
	const { file, board, content } = schema.parse(await req.formData())

	const tmpFile = `/tmp/${file.name}`;
	await pump(file.stream(), fs.createWriteStream(tmpFile));

	const fileHash = hashFile(tmpFile)
	const fileType = await fileTypeFromFile(tmpFile)

	const attachmentType = parseMimeType(fileType.mime)
	if (attachmentType === null)
		return NextResponse.error()

	// TODO: on post deletion, only delete attachment if there isn't other posts linked to it
	const fileName = `${fileHash}.${fileType.ext}`
	const permanentFile = `${mediaPath}/${fileName}`
	if (fs.existsSync(permanentFile)) {
		fs.unlinkSync(tmpFile)
	} else {
		if (!fs.existsSync(mediaPath)) {
			fs.mkdirSync(mediaPath)
		}
		fs.renameSync(tmpFile, permanentFile)
	}

	const post = await db.post.create({
		data: {
			board: {
				connect: {
					shorthand: board
				}
			},
			attachment: {
				create: {
					type: {
						connect: {
							id: attachmentType
						}
					},
					name: fileName
				}
			},
			content
		}
	})

	return NextResponse.redirect(`http://localhost:3000/${board}/${post.id}`, 303)
}