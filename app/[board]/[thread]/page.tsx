import { cache } from "react";
import { notFound } from "next/navigation"

import db from "../../db"
import Post from "@/components/Post";
import { ThreadParams } from "@/types.d";
import PostForm from "@/components/PostForm";

const getThread = cache(async (threadId: number) => {
	return await db.post.findUnique({
		where: {
			id: threadId
		},
		include: {
			attachment: true,
			replies: {
				include: {
					attachment: true
				}
			}
		}
	})
})

export default async ({ params }: ThreadParams) => {
	const thread = await getThread(Number(params.thread))
	if (!thread)
		return notFound()

	console.log("thread:", thread)

	return (
		<div>
			<PostForm
				board={params.board}
				threadId={Number(params.thread)}
			/>
			<Post {...thread} />
		</div>
	)
}