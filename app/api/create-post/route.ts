import { NextRequest, NextResponse } from "next/server";
import fs from "fs"
import { pipeline } from "stream";
import { promisify } from "util";
import { zfd } from "zod-form-data";
import { z } from "zod"
import { fileTypeFromFile } from 'file-type';
import getConfig from "next/config";

import db from "../../db"
import parseMimeType from "@/utils/parseMimeType";
import hashFile from "@/utils/hashFile";

const { serverRuntimeConfig } = getConfig()
const { mediaPath } = serverRuntimeConfig

const pump = promisify(pipeline)
const schema = zfd.formData({
	file: z.custom<File>(),
	board: zfd.text(),
	content: zfd.text(),
	threadId: zfd.numeric().optional()
});

const handleFile = async (file: File) => {
	if (file.size === 0)
		return null;

	const tmpFile = `/tmp/${file.name}`;
	await pump(file.stream(), fs.createWriteStream(tmpFile));

	const fileHash = hashFile(tmpFile)
	const fileType = await fileTypeFromFile(tmpFile)

	const attachmentType = parseMimeType(fileType.mime)
	if (attachmentType === null) {
		fs.unlinkSync(tmpFile)
		throw new Error("Invalid file type")
	}

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

	return { fileName, attachmentType }
}

// TODO: samaan endpoittiin tulee myös vastaukset joten myös niitä pitää tukea (parenting ja konditionaalinen attachment vaatimus)
export async function POST(req: NextRequest) {
	const { file, board, content, threadId } = schema.parse(await req.formData())

	const attachment = await handleFile(file)

	if (!attachment && !threadId)
		return NextResponse.error()

	const post = await db.post.create({
		data: {
			board: {
				connect: {
					shorthand: board
				}
			},
			...(attachment && {
				attachment: {
					create: {
						type: {
							connect: {
								id: attachment.attachmentType
							}
						},
						name: attachment.fileName
					}
				},
			}),
			content,
			...(threadId && {
				parent: {
					connect: {
						id: threadId
					}
				}
			})
		}
	})

	if (threadId) {
		await db.post.update({
			where: {
				id: threadId
			},
			data: {
				replyCount: {
					increment: 1
				},
				...(attachment && {
					imageCount: {
						increment: 1
					}
				})
			}
		})
	}

	const redirectId = threadId ? threadId : post.id;


	// TODO: relative or change url dev/prod
	return NextResponse.redirect(`http://localhost:3000/${board}/${redirectId}`, 303)
}