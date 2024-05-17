import { cache } from "react";
import { notFound } from "next/navigation";
import db from "../../db";
import { ThreadParams } from "@/types.d";
import ThreadPage from "@/components/ThreadPage";
import Link from "next/link";

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
	});
});

export default async ({ params }: ThreadParams) => {
	const thread = await getThread(Number(params.thread));
	if (!thread)
		return notFound();

	return (
		<>
			<Link
				href={`/${params.board}`}
				className="text-slate-800 ml-8 mt-4 mb-4 block"
			>
				{"<-- Return"}
			</Link>
			<ThreadPage board={params.board} thread={thread} />
		</>
	);
};