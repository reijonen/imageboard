import { cache } from "react";
import { notFound } from "next/navigation"

import db from "../../db"
import Post from "@/components/Post";
import { ThreadParams } from "@/types.d";

const getThread = cache(async (threadId: number) => {
	return await db.post.findUnique({
		where: {
			id: threadId
		},
		include: {
			attachment: true
		}
	})
})

export default async ({ params }: ThreadParams) => {
	const post = await getThread(Number(params.thread))
	if (!post)
		return notFound()

	return (
		<div>
			<h1>thread</h1>
			<Post {...post} />
		</div>
	)
}