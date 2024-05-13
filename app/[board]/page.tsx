import { cache } from "react"
import { notFound } from "next/navigation"

import db from "../db"
import PostForm from "@/components/PostForm"
import PostPreview from "@/components/PostPreview"
import { BoardParams } from "@/types.d"

const getBoard = cache(async (board: string) => {
	return await db.board.findUnique({
		where: {
			shorthand: board
		},
		select: {
			name: true,
			shorthand: true,
			posts: {
				include: {
					attachment: {
						select: {
							name: true,
							attachmentTypeId: true
						}
					}
				}
			}
		}
	})
})

export default async function Board({ params }: BoardParams) {
	const board = await getBoard(params.board)
	if (!board)
		return notFound()

	return (
		<div>
			<h1>{board.name}</h1>
			<h2>{board.shorthand}</h2>
			<PostForm board={board.shorthand} />
			{board.posts.map((post) => (
				<PostPreview
					key={post.id}
					board={board.shorthand}
					{...post}
				/>
			))}
		</div>
	)
}