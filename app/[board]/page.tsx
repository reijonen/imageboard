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
				where: {
					parentId: null
				},
				include: {
					attachment: {
						select: {
							name: true,
							attachmentTypeId: true
						}
					}
				},
			}
		}
	})
})

const Board = async ({ params }: BoardParams) => {
	const board = await getBoard(params.board)
	if (!board)
		return notFound()

	console.log("board:", board)

	return (
		<div>
			<h1>{board.name}</h1>
			<h2>{board.shorthand}</h2>
			<PostForm board={board.shorthand} />
			<div className="grid grid-cols-4 gap-4">
				{board.posts.map((post) => (
					<PostPreview
						key={post.id}
						board={board.shorthand}
						{...post}
					/>
				))}
			</div>
		</div>
	)
}

export default Board;