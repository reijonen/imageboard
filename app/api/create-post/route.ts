import { NextRequest, NextResponse } from "next/server";
import fs from "fs"
import { pipeline } from "stream";
import { promisify } from "util";
import { zfd } from "zod-form-data";
import { fileTypeFromFile } from 'file-type';


import db from "../../db"

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

enum AttachmentType {
	Image = 0,
	Video,
	Audio
}

// TODO: samaan endpoittiin tulee myös vastaukset joten myös niitä pitää tukea (parenting ja konditionaalinen attachment vaatimus)
export async function POST(req: NextRequest) {
	const { file, board, content } = schema.parse(await req.formData())

	const fp = `/tmp/${file.name}`;
	await pump(file.stream(), fs.createWriteStream(fp));

	const fileHash = hashFile(fp)
	const fileType = await fileTypeFromFile(fp)

	// TODO: checkkaa onko tiedostoa samalla hashilla levyllä ja jos ei niin siirrä lopulliseen storageen, muuten poista
	// TODO: checkkaa jos fileType.mime !== [image|video|audio] niin error

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
							// TODO: parsi mimetype ja palauta numero AttachmentType perusteella
							id: 0
						}
					},
					hash: fileHash,
					ext: fileType.ext,
				}
			},
			content
		}
	})

	console.log("post:", post)

	return NextResponse.redirect("localhost:3000/")
}