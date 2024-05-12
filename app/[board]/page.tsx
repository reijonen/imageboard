import { cache } from "react"
import { notFound } from "next/navigation"

import db from "../db"

type Params = {
	params: {
		board: string
	}
}

const getBoard = cache(async (board: string) => {
	return await db.board.findUnique({
		where: {
			shorthand: board
		},
		select: {
			name: true,
			shorthand: true,
			posts: true
		}
	})
})

function PostForm({ board }) {

	return (
		<form method="POST" action="/api/create-post" encType="multipart/form-data">
			<input type="file" name="file" accept=".png,.jpg" />
			<label htmlFor="content">Content</label>
			<input id="content" name="content" />
			<input name="board" value={board} hidden />
			<input type="submit" value="Submit" />
		</form>
	)
}

export default async function Board({ params }: Params) {
	const board = await getBoard(params.board)
	if (!board)
		return notFound()

	return (
		<div>
			<h1>{board.name}</h1>
			<h2>{board.shorthand}</h2>
			<PostForm board={board.shorthand} />
			{board.posts.map((post) => (
				<div>
					<p>{post.id}</p>
					<p>{post.createdAt.toDateString()}</p>
					<p>{post.content}</p>
				</div>
			))}
		</div>
	)
}