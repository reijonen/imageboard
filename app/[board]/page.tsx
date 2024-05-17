import { cache } from "react";
import { notFound } from "next/navigation";

import db from "../db";
import BoardPage from "@/components/BoardPage";
import { BoardParams } from "@/types.d";

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
	});
});

const Board = async ({ params }: BoardParams) => {
	const board = await getBoard(params.board);
	if (!board)
		return notFound();

	return (
		<BoardPage board={board} />
	);
};

export default Board;