import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { pipeline } from "stream";
import { promisify } from "util";
import { zfd } from "zod-form-data";
import { ZodError, ZodIssue, z } from "zod";
// @ts-ignore
import { fileTypeFromFile } from 'file-type';
import getConfig from "next/config";

import db from "../../db";
import parseMimeType from "@/utils/parseMimeType";
import hashFile from "@/utils/hashFile";
import { AttachmentType } from "@/types.d";

const { serverRuntimeConfig } = getConfig();
const { mediaPath } = serverRuntimeConfig;

const pump = promisify(pipeline);
const schema = zfd.formData({
	file: z.custom<File>(),
	board: zfd.text(),
	comment: zfd.text(z.string().optional()),
	threadId: zfd.numeric().optional()
});

// @ts-ignore
function formatErrorMessage(errors): string {
	// @ts-ignore
	return errors.map(error => {
		const path = error.path.join('.');
		return `The "${path}" field is ${error.message.toLowerCase()} and must be a ${error.expected}.`;
	}).join(' ');
}

// TODO: samaan endpoittiin tulee myös vastaukset joten myös niitä pitää tukea (parenting ja konditionaalinen attachment vaatimus)
export async function POST(req: NextRequest) {
	try {
		const { file, board, comment, threadId } = schema.parse(await req.formData());

		let attachment = null;
		if (file.size !== 0) {
			const tmpFile = `/tmp/${file.name}`;
			// @ts-ignore
			await pump(file.stream(), fs.createWriteStream(tmpFile));

			const fileHash = hashFile(tmpFile);
			const fileType = await fileTypeFromFile(tmpFile);

			const attachmentType = parseMimeType(fileType.mime);
			if (attachmentType === null || attachmentType !== AttachmentType.Image) {
				fs.unlinkSync(tmpFile);
				return NextResponse.json({ error: "Invalid attachment type" }, { status: 422 });
			}

			// TODO: on post deletion, only delete attachment if there isn't other posts linked to it
			const fileName = `${fileHash}.${fileType.ext}`;
			const permanentFile = `${mediaPath}/${fileName}`;
			if (fs.existsSync(permanentFile)) {
				fs.unlinkSync(tmpFile);
			} else {
				if (!fs.existsSync(mediaPath)) {
					fs.mkdirSync(mediaPath);
				}
				fs.copyFileSync(tmpFile, permanentFile);
				fs.unlinkSync(tmpFile);
			}

			attachment = { attachmentType, fileName };
		}

		if (!attachment && !threadId)
			return NextResponse.json({ error: "Attachment required" }, { status: 400 });

		const content = comment ? comment.trim() : null;
		if ((!content || content.length < 0) && !attachment)
			return NextResponse.json({ error: "Post comment required" }, { status: 400 });

		if (!threadId && attachment && (!content || content.length < 0))
			return NextResponse.json({ error: "Post comment required" }, { status: 400 });

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
				content: content || "",
				...(threadId && {
					parent: {
						connect: {
							id: threadId
						}
					}
				})
			}
		});

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
			});
		}

		const origin = process.env.NODE_ENV === "production" ? process.env.PROD_ORIGIN : process.env.DEV_ORIGIN;
		const redirectId = threadId ? `${threadId}/#${post.id}` : post.id;
		return NextResponse.redirect(`${origin}/${board}/${redirectId}`, 303);
	} catch (e) {
		if (e instanceof ZodError) {
			return NextResponse.json({
				error: formatErrorMessage(e.issues)
			}, { status: 400 });
		} else {
			return NextResponse.error();
		}
	}
}